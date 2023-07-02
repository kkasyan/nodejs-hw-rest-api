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
    avatarURL: String,
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
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

const emailSchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": `Missing requied email field`,
  }),
});

const schemas = { registerSchema, loginSchema, emailSchema };
const User = model("user", userSchema);

module.exports = { User, schemas, userSchema };
