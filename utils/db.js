const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectDb = () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to mongo");
  });
};

module.exports = connectDb;
