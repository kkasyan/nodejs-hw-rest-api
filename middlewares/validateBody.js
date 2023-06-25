const { httpError } = require("./../utils");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { name, email, phone } = req.body;
    const { error } = schema.validate(req.body);

    if (!name & !email & !phone) {
      next(httpError(400, "missing fields"));
    }

    if (error) {
      next(httpError(400, error.message));
    }
    next();
  };
  return func;
};

const validateBodyForPatch = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(httpError(400, error.message));
    }
    next();
  };
  return func;
};

const validation = { validateBody, validateBodyForPatch };

module.exports = validation;
