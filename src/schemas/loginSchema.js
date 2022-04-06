import joi from 'joi';

const loginSchema = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().trim().required()
});

export default loginSchema;