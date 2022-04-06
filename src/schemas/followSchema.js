import joi from 'joi';

const followSchema = joi.object({
    follower: joi.number().integer().required(),
    following: joi.number().integer().required()
});

export default followSchema;