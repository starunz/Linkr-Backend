import { Router } from "express";
import { 
    deleteFollow, 
    getFollowingsByUserId, 
    insertFollow,
} from "../controllers/followsControler.js";
import validateToken from '../middlewares/validateTokenMiddleware.js';
import validateSchemaMiddleware from '../middlewares/validateSchemaMiddleware.js';
import followSchema from '../schemas/followSchema.js';

const followsRouter = Router();

followsRouter.get('/follows/:id', getFollowingsByUserId);
followsRouter.post('/follows', validateToken, validateSchemaMiddleware(followSchema), insertFollow);
followsRouter.delete('/follows/:followingId', validateToken, deleteFollow);


export default followsRouter;