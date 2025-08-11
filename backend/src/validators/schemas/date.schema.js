import Joi from 'joi';

// Common date validation schema
const dateSchema = Joi.alternatives().try(
    Joi.date(),
    Joi.string().isoDate(),
    Joi.valid(null)
);


export default dateSchema;