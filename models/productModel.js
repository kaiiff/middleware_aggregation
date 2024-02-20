const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    product_name: {
      type: String,
    },
    product_brand: {
      type: String,
    },
    product_category: {
      type: String,
    },
    product_image: {
      type: [String],
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
