const User = require("../models/userModel");
const { encode } = require("../middleware/token");
const bcrypt = require("bcrypt");

const Joi = require("joi");

async function hashedPassword(password) {
  return await bcrypt.hashSync(password, 10);
}

async function checkedPassword(plainpassword, hashedPassword) {
  return await bcrypt.compare(plainpassword, hashedPassword);
}

const register_user = async (req, res) => {
  try {
    let { user_name, email, password, phone_number, address } = req.body;
    let newHash = await hashedPassword(password);

    const schema = Joi.object({
      user_name: Joi.string().required(),
      email: Joi.string().required().email().messages({
        "string.empty": `email is a required field.`,
        "string.email": `please enter valid email.`,
      }),
      password: Joi.string().min(6).max(12).required().messages({
        "string.min": `password must be at least {#limit} characters long.`,
        "string.max": `password cannot be longer than {#limit} characters.`,
        "any.required": `password is a required field.`,
      }),
      phone_number: Joi.string()
        .regex(/^[0-9]+$/)
        .length(10)
        .required()
        .messages({
          "string.empty": `phone number is a required field.`,
          "string.pattern.base": `phone number must contain only digits.`,
          "string.length": `phone number must be exactly {#limit} digits long.`,
          "any.required": `phone number is a required field.`,
        }),
      address: Joi.string().allow("").optional(),
    });
    const validation = schema.validate({
      user_name,
      email,
      password,
      phone_number,
      address,
    });

    console.log("validation", validation);

    if (validation.error) {
      return res.status(422).send({
        status: 422,
        message: validation.error.details,
      });
    } else {
      const addUser = await User({
        user_name,
        email,
        password: newHash,
        phone_number,
        address,
      });

      const result = await addUser.save();
      if (result) {
        return res.status(200).json({
          success: true,
          message: "User register successfully!",
          data: result,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "User register failed!",
        });
      }
    }
  } catch (error) {
    return res.send(error.message);
  }
};

const login_user = async (req, res) => {
  try {
    const { email, password } = req.body;
    const schema = Joi.object({
      email: Joi.string().required().email().messages({
        "string.empty": `email is a required field.`,
        "string.email": `please enter valid email.`,
      }),
      password: Joi.string().min(6).max(12).required().messages({
        "string.min": `password must be at least {#limit} characters long.`,
        "string.max": `password cannot be longer than {#limit} characters.`,
        "any.required": `password is a required field.`,
      }),
    });

    const validation = schema.validate({
      email,
      password,
    });

    console.log("validation", validation);

    if (validation.error) {
      return res.status(422).send({
        status: 422,
        message: validation.error.details,
      });
    } else {
      let isMailExist = await User.findOne({ email: email });
      if (!isMailExist) {
        return res.status(400).json({
          success: false,
          message: "email not found!",
        });
      }
    

    const passwordCheck = await checkedPassword(password, isMailExist.password);

    if (!passwordCheck) {
      return res.status(400).json({
        success: false,
        message: "invalid password!",
      });
    }

    const token = await encode({
      id: isMailExist,
    });
    return res.status(200).json({
      success: true,
      message: "user login successfully",
     user_id:isMailExist.id,
      token: token,
    });
}
  } catch (error) {
    return res.send(error.message);
  }

};

module.exports = {
  register_user,
  login_user,
};
