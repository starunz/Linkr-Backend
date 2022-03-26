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
        
        res.send(posts);

    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }

}

export async function like(req, res) {
    const userId = req.body.userId;
    const postId = req.body.postId;

    try {
        const isLiked = await connection.query(`
            SELECT * 
            FROM likes 
            WHERE likes."postId" = $1
            AND likes."userId" = $2
        `, [postId, userId])
        
        if(isLiked.rows.length === 0) {
            
            await connection.query(`
                INSERT INTO 
                    likes ("userId", "postId") 
                VALUES ($1, $2)
            `, [userId, postId])

            return res.sendStatus(201)
        }

        await connection.query(`
            DELETE FROM likes
                WHERE "userId" = $1
                AND "postId" = $2
        
        `, [userId, postId])

        res.sendStatus(201)
            
    } catch (error) {
        res.sendStatus(500)
    }
}

export async function getLike(req, res) {
    const { postId } = req.params;
    const userId = res.locals.userId;
    let isLiked = false;

    try {
        
        const likes = await connection.query(`
            SELECT 
                likes."postId", COUNT("userId") 
            FROM likes 
            WHERE likes."postId" = $1
            GROUP BY likes."postId";
        `, [parseInt(postId)]) 
     
        if(likes.rows.length === 0 ) {
            return res.status(200).send([{ postId: parseInt(postId), count: 0, isLiked: isLiked}])
        }

        const userLike = await connection.query(`
            SELECT * 
            FROM likes
            WHERE likes."postId" = $1
            AND likes."userId" = $2
        `, [parseInt(postId), userId])

        if (userLike.rows.length !== 0) {
            isLiked = true;
        }

        likes.rows[0].isLiked = isLiked;
        res.status(200).send(likes.rows)

    } catch (error) {
        res.sendStatus(500)
    }

}

export async function deletePosts(req, res) {
    const {id} = req.params;

    try {

        await connection.query(`
            DELETE FROM posts WHERE id = $1;
        `, [id]);

    } catch (error) {

        console.log(error.message);
        res.sendStatus(500);
        
    }
    
    res.sendStatus(200);
}