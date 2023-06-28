const Joi = require("joi");
const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../utils");

const subscriptionType = ["starter", "pro", "business"];

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
      enum: subscriptionType,
      default: "starter",
    },
    token: String,
  },
  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": `Missing requied password field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `Missing requied email field`,
  }),
  subscription: Joi.string().valid(...subscriptionType),
});

const loginSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": `Missing requied password field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `Missing requied email field`,
  }),
  subscription: Joi.string().valid(...subscriptionType),
});

const schemas = { registerSchema, loginSchema };
const User = model("user", userSchema);

module.exports = { User, schemas, userSchema };
