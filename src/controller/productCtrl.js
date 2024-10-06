// import Product from "../model/productMdl.js";
// import dotenv from "dotenv";
// dotenv.config();
// export const CreateProduct = async (req, res) => {
//   try {
//     const { name, price, conLai, branch } = req.body;
//     const id = req.user;
//     if (req.user.role !== "seller") {
//       return res.status(400).json("User is not auth");
//     }
//     if (!name || !price || !conLai) {
//       return res.status(400).json("Please field all!");
//     }
//     const newProduct = await Product.create({
//       user: id,
//       name,
//       price,
//       conLai,
//       branch,
//     });
//     return res.status(200).json(newProduct);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

// export const updateProduct = async (req, res) => {
//   try {
//     const { idProduct, name, price, conLai } = req.body;
//     const product = await Product.findById(idProduct);
//     if (
//       req.user._id.toString() !== product.user.toString() ||
//       req.user.role !== "seller"
//     ) {
//       return res.status(400).json("User is not auth");
//     }
//     const newUpdateProduct = await Product.findByIdAndUpdate(
//       { _id: idProduct },
//       { name, price, conLai },
//       { new: true }
//     );
//     return res.status(200).json(newUpdateProduct);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

// export const deleteProduct = async (req, res) => {
//   try {
//     const { idProduct } = req.body;
//     const product = await Product.findById(idProduct);
//     if (
//       req.user._id.toString() !== product.user.toString() ||
//       req.user.role !== "seller"
//     ) {
//       return res.status(400).json("User is not auth");
//     }
//     const newUpdateProduct = await Product.findByIdAndDelete(idProduct);
//     return res.status(200).json("Delete product success");
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

// export const getProduct = async (req, res) => {
//   try {
//     const { branchName, page, limit } = req.body;
//     const startIndex = (page - 1) * limit;
//     if (!branchName) {
//       const allProduct = await Product.find({})
//         .sort({ daBan: -1 })
//         .skip(startIndex)
//         .limit(limit);
//       return res.status(200).json(allProduct);
//     } else {
//       const productA = await Product.find({ branch: branchName })
//         .sort({ daBan: -1 })
//         .skip(startIndex)
//         .limit(limit);

//       return res.status(200).json(productA);
//     }
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

// export const getBestSeller = async (req, res) => {
//   try {
//     const { page, limit } = req.body;
//     const startIndex = (page - 1) * limit;
//     const allProduct = await Product.find({})
//       .sort({ banTrongThang: -1 })
//       .skip(startIndex)
//       .limit(limit);

//     return res.status(200).json(allProduct);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };
