const Joi = require('joi');

// Validate user registration
const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    profilePicture: Joi.string().uri().optional(),
    role: Joi.string().valid('customer', 'manager', 'owner'),
  
    verifyOtp: Joi.string().allow('').optional(),
    verifyOtpExpiredAt: Joi.string().isoDate().optional(),
    isAccountVerified: Joi.boolean().optional(),
    resetOtp: Joi.string().allow('').optional(),
    resetOtpExpiredAt: Joi.string().isoDate().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};


// Validate user registration
const validateUserData = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    phone: Joi.string().optional(),
    licenseNumber: Joi.string().optional(),
    profilePicture: Joi.string().uri().optional(),
    role: Joi.string().valid('customer', 'manager', 'owner'),

    verifyOtp: Joi.string().allow('').optional(),
    verifyOtpExpiredAt: Joi.string().isoDate().optional(),
    isAccountVerified: Joi.boolean().optional(),
    resetOtp: Joi.string().allow('').optional(),
    resetOtpExpiredAt: Joi.string().isoDate().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};


// Validate car creation
const validateCar = (req, res, next) => {
  const schema = Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
    color: Joi.string().required(),
    licensePlate: Joi.string().required(),
    rentalRate: Joi.number().required(),
    status: Joi.string().valid('available', 'rented', 'maintenance'),
    imageUrl: Joi.string().uri(),
    features: Joi.array().items(Joi.string())
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};


// Validate rental creation
const validateRental = (req, res, next) => {
  const schema = Joi.object({
    carId: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    totalAmount: Joi.number().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateUser, validateUserData, validateCar, validateRental };