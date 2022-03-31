import { Router } from "express";
import validateToken from '../middlewares/validateTokenMiddleware.js';
import { insertComment, getComments } from "../controllers/commentController.js";

const commentsRouter = Router();

commentsRouter.post('/post/:postId/comment', validateToken, insertComment);
commentsRouter.get('/post/:postId/comments', getComments);

export default commentsRouter;