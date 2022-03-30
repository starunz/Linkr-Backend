import { authRepository } from "../repositories/authRepository.js";
import { userRepository } from "../repositories/userRepository.js";


export default async function validateToken(req, res, next) {

    try {
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');
        if (!token) {
            return res.sendStatus(401);
        }

        const {rows: session} = await authRepository.selectSessionByToken(token);
        if (session.length === 0) {
            return res.sendStatus(401);
        }

        const {rows: user} = await userRepository.getUserDataById(session[0].userId);
        if (user.length === 0) {
            return res.sendStatus(401);
        }
        
        res.locals.userId = session[0].userId;
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}