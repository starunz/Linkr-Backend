import { Router } from "express";

import authRouter from "./authRouter.js";
import postsRouter from "./postsRouter.js";
import userRouter from "./userRouter.js";
import hashtagsRouter from "./hashtagsRouter.js";
import followsRouter from "./followsRouter.js";
import commentsRouter from "./commentsRouter.js";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(postsRouter);
router.use(hashtagsRouter);
router.use(followsRouter);
router.use(commentsRouter);

export default router;