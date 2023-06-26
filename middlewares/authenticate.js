const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { User } = require("../models/user");
const { httpError } = require("../utils");
const { SECRET_KEY } = process.env;

dotenv.config();

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  // const { contactId } = req.params;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(httpError(401, "Not authorized"));
  }

  try {
    const { contactId: id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(httpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    next(httpError(401, "Not authorized"));
  }
};

module.exports = authenticate;
