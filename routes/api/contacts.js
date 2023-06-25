const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getById,
  addContact,
  deleteContact,
  editContact,
  updateStatusContact,
} = require("../../controllers/contacts");

const { validation, isValidId } = require("./../../middlewares");
const { schemas } = require("../../models/contact");

router.get("/", getAllContacts);

router.get("/:contactId", isValidId, getById);

router.post("/", validation.validateBody(schemas.addSchema), addContact);

router.delete("/:contactId", isValidId, deleteContact);

router.put(
  "/:contactId",
  isValidId,
  validation.validateBody(schemas.addSchema),
  editContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validation.validateBodyForPatch(schemas.updateFavSchema),
  updateStatusContact
);

module.exports = router;
