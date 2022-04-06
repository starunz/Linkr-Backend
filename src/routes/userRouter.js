import { Router } from "express";
import { createUser, getUserDataById, getUsers, getUserPosts } from "../controllers/userController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import validateToken from "../middlewares/validateTokenMiddleware.js";

import userSchema from "../schemas/userSchema.js";

const userRouter = Router();
userRouter.post('/sign-up', validateSchemaMiddleware(userSchema), createUser);
userRouter.get('/users/:id', validateToken, getUserDataById);
userRouter.get('/users', getUsers);
userRouter.get('/user/:id', getUserPosts)

export default userRouter;