const Joi = require("joi");

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
});

module.exports = { addSchema };
