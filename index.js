const express = require("express");
const dotEnv = require("dotenv");
dotEnv.config();
const Db = require("./utils/db");
Db();
const path = require("path");

const app = express();

const port = process.env.PORT;

var bodyParser = require("body-parser");

const userRouter = require("./router/userRouter");
const productRouter = require("./router/productrouter");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRouter);
app.use("/product", productRouter);

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
