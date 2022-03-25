import connection from "../db.js";


export default async function validateToken(req, res, next) {

    try {
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');
        if (!token) {
            return res.sendStatus(401);
        }

        const {rows: session} = await connection.query(`
        SELECT * FROM sessions WHERE token = $1
        `, [token]);
        if (session.length === 0) {
            return res.sendStatus(401);
        }

        const {rows: user} = await connection.query(`
            SELECT * FROM users WHERE $1 = users.id
        `, [session[0].userId]);
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