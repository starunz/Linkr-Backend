import { Router } from "express";
import { publishPosts } from "../controllers/postsController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import { postsSchemas } from "../schemas/postsSchema.js";

const postsRouter = Router();
postsRouter.post('/posts', validateSchemaMiddleware(postsSchemas), publishPosts);

export default postsRouter;