import connection from "../db.js";

async function createComment(userId, postId, text) {
    return connection.query(`
        INSERT INTO
        comments ("userId", "postId", "text")
        VALUES ($1, $2, $3)
    `, [userId, postId, text]);
}

async function getComments(postId){
    return connection.query(`
        SELECT c.*, u."userName" as author  
        FROM comments c
        JOIN users u ON u.id = c."userId"
        WHERE c."postId" = $1
    `, [postId]);
}

export const commentRepository = { 
    createComment,
    getComments
}