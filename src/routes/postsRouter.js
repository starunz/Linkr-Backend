import { Router } from "express";
import { getPosts, publishPosts, like, getLike, deletePosts, updatePosts } from "../controllers/postsController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import validateToken from "../middlewares/validateTokenMiddleware.js";
import { postsSchemas } from "../schemas/postsSchema.js";

const postsRouter = Router();
postsRouter.post('/posts', validateSchemaMiddleware(postsSchemas), publishPosts);
postsRouter.get('/posts', validateToken, getPosts);
postsRouter.post('/like', validateToken, like);
postsRouter.get('/like/:postId',validateToken ,getLike);
postsRouter.delete('/posts/:id', validateToken, deletePosts);
postsRouter.put('/posts/:id', validateToken, updatePosts);


export default postsRouter;