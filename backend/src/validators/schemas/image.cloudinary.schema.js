import Joi from 'joi';

// Common image validation schema for single or multiple images
const imageSchema = Joi.alternatives().try(
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
);


export default imageSchema;