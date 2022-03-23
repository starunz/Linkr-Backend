import joi from "joi";

export const postsSchemas = joi.object({
  userId: joi.integer().required(),
  URL: joi.string().uri().required(),
  description: joi.string().required(),
});

export default userSchema;