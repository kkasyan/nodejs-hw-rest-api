const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getById,
  addContact,
  deleteContact,
  editContact,
} = require("../../controllers/contacts");

const { validateBody } = require("./../../middlewares");
const schemas = require("./../../schemas/contacts");

router.get("/", getAllContacts);

router.get("/:contactId", getById);

router.post("/", validateBody(schemas.addSchema), addContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", validateBody(schemas.addSchema), editContact);

module.exports = router;
