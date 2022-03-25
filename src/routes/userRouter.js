import { Router } from "express";
import { createUser, getUserDataById } from "../controllers/userController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import validateToken from "../middlewares/validateTokenMiddleware.js";

import userSchema from "../schemas/userSchema.js";

const userRouter = Router();
userRouter.post('/sign-up', validateSchemaMiddleware(userSchema), createUser);
userRouter.get('/users/:id', validateToken, getUserDataById);

export default userRouter;