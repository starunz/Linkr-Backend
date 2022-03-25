import connection from '../db.js';
import urlMetadata from 'url-metadata';
import { insertHashtags } from './hashtagsController.js';
import addSpaceHashtagsStuck from '../utilityFunctions.js';

export async function publishPosts(req, res) {
    const {userId, link, description} = req.body;

    const descriptionResolve = addSpaceHashtagsStuck(description);

    const hashtags = (descriptionResolve.includes('#') ? (
        descriptionResolve.match(/#\w+/g).map(x => x.substr(1).toLowerCase()) || [] 
    ) : []);

    console.log(hashtags);
    
    try {
        const {image, description: descriptionLink, title} = await urlMetadata(link);

        await connection.query(`
            INSERT INTO posts
            ("userId", link, description)
            VALUES ($1, $2, $3);
        `, [userId, link, descriptionResolve]);

        const {rows: postId} = await connection.query(`
            SELECT MAX(id) FROM posts
        `); 

        await insertHashtags(hashtags, postId[0].max);

        res.sendStatus(201);

    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
}

export async function getPosts(req, res) {
    try {
        const {rows: posts} = await connection.query(`
            SELECT 
                p.description, u."userName" author, u."photoUrl", p.link
            FROM posts p
            LEFT JOIN users u on p."userId" = u.id 
            GROUP BY description, author, "photoUrl", p.id
            ORDER BY p.id DESC
            LIMIT 20
        `);
        
        res.send(posts);

    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }

}