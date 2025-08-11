import Joi from 'joi';
import imageSchema from './schemas/image.schema';
import phoneSchema from './schemas/phoneNumber.schema';
import dateSchema from './schemas/date.schema';

// CREATE VALIDATOR - With defaults
const validateUser = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(128).required(),
    phone: phoneSchema.required(),
    licenseNumber: Joi.string().min(3).max(20).required(),
    role: Joi.string().valid('customer', 'manager', 'owner').default('customer'),
    profilePicture: imageSchema.optional(),
    
    googleId: Joi.string().allow('').default(''),
    verifyOtp: Joi.string().allow('').default(''),
    verifyOtpExpiredAt: dateSchema.default(null),
    isAccountVerified: Joi.boolean().default(false),
    resetOtp: Joi.string().allow('').default(''),
    resetOtpExpiredAt: dateSchema.default(null),
  });

  // THE KEY CHANGE: Use the validated value with defaults applied
  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    stripUnknown: true,
    abortEarly: false
  });

  if (error) {
    return res.status(400).json({ 
        success: false,
        message: error.details[0].message,
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
    });
  }

  // Replace req.body with the validated value that includes defaults
  req.body = value;
  next();
};


// UPDATE VALIDATOR - NO defaults, all fields optional
const validateUserUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "Validation failed"});
  }

  const schema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().lowercase().optional(),
    password: Joi.string().min(6).max(128).optional(),
    phone: phoneSchema.optional(),
    licenseNumber: Joi.string().min(3).max(20).optional(),
    role: Joi.string().valid('customer', 'manager', 'owner').optional(),
    profilePicture: imageSchema.optional(),
    
    googleId: Joi.string().allow('').optional(),
    verifyOtp: Joi.string().allow('').optional(),
    verifyOtpExpiredAt: dateSchema.optional(),
    isAccountVerified: Joi.boolean().optional(),
    resetOtp: Joi.string().allow('').optional(),
    resetOtpExpiredAt: dateSchema.optional()
  })
  .min(1) // Require at least one field to update
  .options({ stripUnknown: true });; 

  // THE KEY CHANGE: Use the validated value with defaults applied
  const { error, value } = schema.validate(req.body, {
    allowUnknown: false,
    abortEarly: false
  });

  if (error) {
    console.log("Validation error: " + error.details[0].message)
    return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
    });
  }

  // Replace req.body with the validated value that includes defaults
  req.body = value;
  next();
};




export { validateUser, validateUserUpdate };