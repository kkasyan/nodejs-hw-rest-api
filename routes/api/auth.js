const express = require("express");
const {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
} = require("../../controllers/auth");
const { validation, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

router.post(
  "/register",
  validation.validateBody(schemas.registerSchema),
  register
);

router.post("/login", validation.validateBody(schemas.loginSchema), login);

router.get("/verify/:verificationToken", verifyEmail);

router.post(
  "/verify",
  validation.validateBodyForPatch(schemas.emailSchema),
  resendVerificationEmail
);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
