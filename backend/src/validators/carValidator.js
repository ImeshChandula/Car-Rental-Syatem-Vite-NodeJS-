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