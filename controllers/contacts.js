const contacts = require("./../models/contact");
const { httpError, controllerWrapper } = require("./../utils");

const getAllContacts = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.getContactById(contactId);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const editContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.updateContact(contactId, req.body);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  getAllContacts: controllerWrapper(getAllContacts),
  getById: controllerWrapper(getById),
  addContact: controllerWrapper(addContact),
  deleteContact: controllerWrapper(deleteContact),
  editContact: controllerWrapper(editContact),
};
