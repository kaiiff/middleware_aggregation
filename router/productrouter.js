const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const uploadImage = require("../middleware/productImage");
const { add_product, get_product } = require("../controller/productController");

router.post("/add_product", uploadImage.array("files", 10), auth, add_product);
router.get("/get_product", auth, get_product);

module.exports = router;
