import connection from '../db.js';

export async function publishPosts(req, res) {

    const {userId, link, description} = req.body;
    try {
        await connection.query(`
            INSERT INTO posts
            ("userId", link, description)
            VALUES ($1, $2, $3)
        `, [userId, link, description]);

        res.sendStatus(200);

    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
}