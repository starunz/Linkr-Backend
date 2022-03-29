import connection from "../db.js";

async function publishPosts(userId, link, descriptionResolve, descriptionLink, image, title) {
    return connection.query(`
            INSERT INTO posts
            ("userId", link, description, "descriptionLinK", "imageLink", "titleLink")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `, [userId, link, descriptionResolve, descriptionLink, image, title]);

}

async function getPosts() {
    return connection.query(`
            SELECT 
                p.*, u."userName" author, u."photoUrl"
            FROM posts p
            LEFT JOIN users u on p."userId" = u.id 
            GROUP BY description, author, "photoUrl", p.id
            ORDER BY p.id DESC
            LIMIT 20
        `);
}

async function isLiked(postId, userId){
    return connection.query(`
            SELECT * 
            FROM likes 
            WHERE likes."postId" = $1
            AND likes."userId" = $2
        `, [postId, userId]);
}

async function insertLike(userId, postId) {
    return connection.query(`
            INSERT INTO 
                likes ("userId", "postId") 
            VALUES ($1, $2)
        `, [userId, postId]);
}

async function deleteLike(userId, postId){
    return connection.query(`
            DELETE FROM likes
            WHERE "userId" = $1
            AND "postId" = $2
        `, [userId, postId]);
}

async function selectLikes(postId){
    return connection.query(`
            SELECT 
                likes."postId", COUNT("userId") 
            FROM likes 
            WHERE likes."postId" = $1
            GROUP BY likes."postId"
        `, [parseInt(postId)]);
}

async function userLikes(postId, userId){
    return connection.query(`
            SELECT * 
            FROM likes
            WHERE likes."postId" = $1
            AND likes."userId" = $2
        `, [parseInt(postId), userId]);
}

async function whoLiked(postId){
    return connection.query(`
            SELECT 
            users."userName", users.id  
            FROM likes 
            JOIN users on users.id = likes."userId" 
            WHERE likes."postId" = $1 
        `, [parseInt(postId)]); 
}

async function deletePosts(id){
    return connection.query(`
            DELETE FROM posts WHERE id = $1;
        `, [id]);
}

async function deleteHashtagsByPostId(postId){
    return connection.query(`
            DELETE FROM hashtagsposts WHERE "postId" = $1;
        `, [postId]);
}

async function updatePosts(descriptionResolve, postId){
    return connection.query(`
            UPDATE posts
            SET description = $1
            WHERE id = $2
        `, [descriptionResolve, postId]);
}

export const postsRepository = {
    publishPosts,
    getPosts,
    isLiked,
    insertLike,
    deleteLike,
    selectLikes,
    userLikes,
    whoLiked,
    deletePosts,
    deleteHashtagsByPostId,
    updatePosts
}