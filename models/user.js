const Joi = require("joi");
const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../utils");

const subscribtionType = ["starter", "pro", "business"];

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscribtionType,
      default: "starter",
    },
    token: String,
  },
  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
  subscribtion: Joi.string().valid(...subscribtionType).required,
});

const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
  subscribtion: Joi.string().valid(...subscribtionType).required,
});

const schemas = { registerSchema, loginSchema };
const User = model("user", userSchema);

module.exports = { User, schemas, userSchema };
