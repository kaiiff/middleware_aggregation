const express = require("express");
const { register_user, login_user } = require("../controller/userController");
const router = express.Router();

router.post("/register_user", register_user);
router.post("/login_user", login_user);

module.exports = router;
