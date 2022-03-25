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

    try {
        const {image, description: descriptionLink, title} = await urlMetadata(link);

        const {rows: postId} = await connection.query(`
            INSERT INTO posts
            ("userId", link, description, "descriptionLinK", "imageLink", "titleLink")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `, [userId, link, descriptionResolve, descriptionLink, image, title]);

        await insertHashtags(hashtags, postId[0].id);

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
                p.*, u."userName" author, u."photoUrl"
            FROM posts p
            LEFT JOIN users u on p."userId" = u.id 
            GROUP BY description, author, "photoUrl", p.id
            ORDER BY p.id DESC
            LIMIT 20
        `);
<<<<<<< HEAD
        
=======
       /*
        for (const post of posts) {
            const {image, title, description} = await urlMetadata(post.link);

            post.linkImage = image;
            post.linkTitle = title;
            post.linkDescription = description;
        }
        */
>>>>>>> 14a854bc19721991bd4e2c9edb4b05fd4c06bf1d
        res.send(posts);

    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }

}