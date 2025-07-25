import Joi from 'joi';

// CREATE VALIDATOR - With defaults
const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(128).required(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required(), // Basic international phone format
    licenseNumber: Joi.string().min(3).max(20).required(),
    role: Joi.string().valid('customer', 'manager', 'owner').default('customer'),
    profilePicture: Joi.alternatives().try(
              Joi.string().uri(),                         // media link
              Joi.string().pattern(/^data:.*;base64,.*/), // base64 image/video
              Joi.array().items(
                Joi.alternatives().try(
                  Joi.string().uri(),                         // media URL in array
                  Joi.string().pattern(/^data:.*;base64,.*/), // base64 in array
                  Joi.object({                                // file object from multer
                    path: Joi.string().required()
                  })
                )
              ),
              Joi.valid(null)
            ).optional(),
    
    googleId: Joi.string().allow('').default(''),
    verifyOtp: Joi.string().allow('').default(''),
    verifyOtpExpiredAt: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).default(null),
    isAccountVerified: Joi.boolean().default(false),
    resetOtp: Joi.string().allow('').default(''),
    resetOtpExpiredAt: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).default(null),
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
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().lowercase().optional(),
    password: Joi.string().min(6).max(128).optional(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(), // Basic international phone format
    licenseNumber: Joi.string().min(3).max(20).optional(),
    role: Joi.string().valid('customer', 'manager', 'owner').optional(),
    profilePicture: Joi.alternatives().try(
              Joi.string().uri(),                         // media link
              Joi.string().pattern(/^data:.*;base64,.*/), // base64 image/video
              Joi.array().items(
                Joi.alternatives().try(
                  Joi.string().uri(),                         // media URL in array
                  Joi.string().pattern(/^data:.*;base64,.*/), // base64 in array
                  Joi.object({                                // file object from multer
                    path: Joi.string().required()
                  })
                )
              ),
              Joi.valid(null)
            ).optional(),
    
    googleId: Joi.string().allow('').optional(),
    verifyOtp: Joi.string().allow('').optional(),
    verifyOtpExpiredAt: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).optional(),
    isAccountVerified: Joi.boolean().optional(),
    resetOtp: Joi.string().allow('').optional(),
    resetOtpExpiredAt: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate(),
      Joi.valid(null)
    ).optional(),
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