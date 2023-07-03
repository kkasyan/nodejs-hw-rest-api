const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");
const { nanoid } = require("nanoid");

const { User } = require("../models/user");
const { httpError, controllerWrapper, sendEmail } = require("./../utils");
const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

dotenv.config();

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: gravatar.url(email),
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verification email",
    html: `<a href="${BASE_URL}/users/verify/${verificationToken}">Please verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw httpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.status(200).json({ message: "Verification successful" });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(401, "Email not found");
  }

  if (user.verify) {
    throw httpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verification email",
    html: `<a href="${BASE_URL}/users/verify/${user.verificationToken}">Please verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw httpError(401, "This user is not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw httpError(401, "Email or password is wrong");
  }

  const payload = { contactId: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "13h" });

  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, { token: "" });
  return res.status(204).json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  const image = await jimp.read(tempUpload);
  await image.resize(250, 250).writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: controllerWrapper(register),
  verifyEmail: controllerWrapper(verifyEmail),
  resendVerificationEmail: controllerWrapper(resendVerificationEmail),
  login: controllerWrapper(login),
  getCurrent: controllerWrapper(getCurrent),
  logout: controllerWrapper(logout),
  updateAvatar: controllerWrapper(updateAvatar),
};
