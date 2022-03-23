import joi from "joi";

export const postsSchemas = joi.object({
  userId: joi.number().integer().required(),
  link: joi.string().uri().required(),
  description: joi.string().allow(null).allow('').optional()
});

export default postsSchemas;