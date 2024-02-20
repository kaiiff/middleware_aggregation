const Product = require("../models/productModel");
const Joi = require("joi");

const add_product = async (req, res) => {
  try {
    const userId = req.user;
    const { product_name, product_brand, product_category } = req.body;
    const schema = Joi.object({
      product_name: Joi.string().required(),
      product_brand: Joi.string().required(),
      product_category: Joi.string().required(),
    });

    const validation = schema.validate({
      product_name,
      product_brand,
      product_category,
    });

    if (validation.error) {
      return res.status(422).send({
        status: 422,
        message: validation.error.details,
      });
    } else {
      const addproduct = new Product({
        userId: userId,
        product_name,
        product_brand,
        product_category,
      });

      let filesArray = []; // Initialize filesArray to an empty array

      if (req.files && req.files.length > 0) {
        req.files.forEach(function (file) {
          filesArray.push(process.env.base_url + file.filename); // Push each file URL to the filesArray
        });
        addproduct.product_image = filesArray;
      }

      const data = await addproduct.save();

      if (!data) {
        return res.send("add product failed");
      } else {
        return res.status(200).json({
          message: "Product add successfully!",
          data: data,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.send(error.message);
  }
};

const get_product = async (req, res) => {
  try {
    const userId = req.user;
    console.log("userId===>>>>", userId);

    const query = [
      
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Unwind to get user details as object instead of an array
      },
    ];

    const result = await Product.aggregate(query);

    if (result) {
      return res.status(200).json({
        success: true,
        message: "Product detaails fetch successfully!",
        data: result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Product detaails fetch failed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send(error.message);
  }
};

module.exports = {
  add_product,
  get_product,
};
