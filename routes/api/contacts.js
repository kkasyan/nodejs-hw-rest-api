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

const { validation, isValidId, authenticate } = require("./../../middlewares");
const { schemas } = require("../../models/contact");

router.get("/", authenticate, getAllContacts);

router.get("/:contactId", authenticate, isValidId, getById);

router.post(
  "/",
  authenticate,
  validation.validateBody(schemas.addSchema),
  addContact
);

router.delete("/:contactId", authenticate, isValidId, deleteContact);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validation.validateBody(schemas.addSchema),
  editContact
);

// router.patch(
//   "/:contactId/favorite",
//   authenticate,
//   isValidId,
//   validation.validateBodyForPatch(schemas.updateFavSchema),
//   updateStatusContact
// );

module.exports = router;
