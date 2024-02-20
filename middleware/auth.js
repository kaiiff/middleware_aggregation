const jwt = require("jsonwebtoken");
const  fetchUserById  = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];

      if (!token) {
        return res.status(400).json({
          message: "Token Not Provided",
          success: false,
        });
      }

      try {
        const verifyUser = jwt.verify(token, "kaifjwt");
        
        if (!verifyUser || !verifyUser.id || !verifyUser.id._id) {
          return res.status(401).json({
            message: "Invalid Token",
            success: false,
          });
        }
      
        const userId = verifyUser.id._id;
        const user = await fetchUserById({ id: userId });
      
        if (user !== null) {
          req.user = userId;
          next();
        } else {
          return res.status(403).json({
            message: "Access Forbidden",
            success: false,
          });
        }
      } catch (err) {
        console.error(err);
        return res.status(401).json({
          message: "Invalid Token",
          success: false,
        });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports = auth;
