const Joi = require("joi");
const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../utils");

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: { type: Boolean, default: false },
  },
  { versionKey: false }
);

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

const addSchema = Joi.object({
  name: Joi.string().min(3).max(38).required().messages({
    "any.required": `Missing requied name field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `Missing requied email field`,
  }),
  phone: Joi.string().min(6).max(15).required().messages({
    "any.required": `Missing requied phone field`,
  }),
  favorite: Joi.boolean(),
});

const updateFavSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing field favorite",
  }),
});

const schemas = { addSchema, updateFavSchema };

module.exports = { Contact, schemas };
