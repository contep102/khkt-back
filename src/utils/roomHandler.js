export const addMember = (data, mapOfMembers, socketToRooms) => {
  const { roomId, email, socket } = data;
  if (mapOfMembers.has(roomId)) {
    const memberArr = mapOfMembers.get(roomId);
    memberArr.push({ socketId: socket.id, email: email });
    mapOfMembers.set(roomId, memberArr);
    memberArr.forEach((member) => {
      const { socketId } = member;
      socket
        .to(socketId)
        .emit("connection-prepare", { incomingSocketId: socket.id });
    });
  } else {
    mapOfMembers.set(roomId, [{ socketId: socket.id, email: email }]);
  }
  socketToRooms.set(socket.id, roomId);
  initialUpdate(mapOfMembers, socketToRooms);
};

export const initialUpdate = (members, socketToRooms) => {
  console.log("members", members);
  console.log("socket => room", socketToRooms);
};

export const notifiyParticipantLeftRoom = (socket, roomId) => {
  const RoomLeavingParticipantId = socket.id;
  socket
    .to(roomId)
    .emit("notify-participant-left-room", RoomLeavingParticipantId);
};

export const leaveRoom = (socket, mapOfMembers, socketToRooms) => {
  const memberArr = mapOfMembers.get(roomId);

  if (!memberArr) return;

  const filterMembers = memberArr.filter((member) => {
    return member.socketId !== socket.id;
  });

  if (!filterMembers.length) {
    mapOfMembers.delete(roomId);
    socketToRooms.delete(socket.id);
    initialUpdate(mapOfMembers, socketToRooms);
    return;
  }

  notifiyParticipantLeftRoom(socket, roomId);

  mapOfMembers.set(roomId, filterMembers);

  socketToRooms.delete(socket.id);

  initialUpdate(mapOfMembers, socketToRooms);
};
export const getUserName = (socketIdToBeQueried, roomId, roomMembersMap) => {
  const members = roomMembersMap.get(roomId);

  if (!members) return;

  const user = members.find((member) => {
    if (member.socketId === socketIdToBeQueried) return member;
  });

  return user;
};
