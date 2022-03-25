import connection from '../db.js';
import urlMetadata from 'url-metadata';
import { insertHashtags } from './hashtagsController.js';

export async function publishPosts(req, res) {
    const {userId, link, description} = req.body;

    const hashtags = description.match(/#\w+/g).map(x => x.substr(1).toLowerCase()) || [];

    try {
        await connection.query(`
            INSERT INTO posts
            ("userId", link, description)
            VALUES ($1, $2, $3);
        `, [userId, link, description]);

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
                p.id "postId", p.description, u."userName" author, u."photoUrl", p.link
            FROM posts p
            LEFT JOIN users u on p."userId" = u.id 
            GROUP BY description, author, "photoUrl", p.id
            ORDER BY p.id DESC
            LIMIT 20
        `);

        for (const post of posts) {
            const {image, title, description} = await urlMetadata(post.link);

            post.linkImage = image;
            post.linkTitle = title;
            post.linkDescription = description;
        }
        
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
            return res.send([{ postId: parseInt(postId), count: 0, isLiked: isLiked}])
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
        res.send(likes.rows)

    } catch (error) {
        res.sendStatus(500)
    }

}