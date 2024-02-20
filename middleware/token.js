const jwt = require("jsonwebtoken");

const encode = async (payload) => {
  return jwt.sign(payload, "kaifjwt");
};

const decode = async (payload) => {
  return jwt.decode(payload, "kaifjwt");
};

module.exports = {
  encode,
  decode,
};
