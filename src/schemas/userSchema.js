import joi from "joi";

const userSchema = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().trim().required(),
  username: joi.string().min(3).trim().required(),
  photoUrl: joi.string().uri().trim().required(),
});

export default userSchema;
