const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    user_name: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phone_number: {
      type: Number,
      required: [true, "phone number is required"],
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
