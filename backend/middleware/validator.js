const Joi = require('joi');

// Validate user registration
const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    role: Joi.string().valid('customer', 'manager', 'owner')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateUser, };