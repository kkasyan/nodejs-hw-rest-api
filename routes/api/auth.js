const express = require("express");
const {
  register,
  login,
  getCurrent,
  logout,
} = require("../../controllers/auth");
const { validation, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

router.post(
  "/register",
  validation.validateBody(schemas.registerSchema),
  register
);

router.post("/login", validation.validateBody(schemas.loginSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

module.exports = router;
