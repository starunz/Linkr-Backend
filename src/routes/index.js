import { Router } from "express";
import authRouter from "./authRouter.js";
import postsRouter from "./postsRouter.js";
import userRouter from "./userRouter.js";
import hashtagsRouter from "./hashtagsRouter.js";

const router = Router();
router.use(authRouter);
router.use(userRouter);
router.use(postsRouter);
router.use(hashtagsRouter);

export default router;