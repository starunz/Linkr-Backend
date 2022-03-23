import { Router } from "express";
import { postLinkr } from "../controllers/postController.js";

const postRouter = Router();

postRouter.post('/posts', postLinkr);

export default postRouter;