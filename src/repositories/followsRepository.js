import connection from "../db.js";

export async function selectFollowingsUsers(id) {
    return connection.query(`
        SELECT following 
        FROM follows
        WHERE follower = $1
    `, [id]);
}

export async function createFollow(follower, following) {
    return connection.query(`
        INSERT INTO follows
        (follower, following)
        VALUES ($1, $2)
    `, [follower, following]);
}

export async function getIdUserByToken(token) {
    return connection.query(`
        SELECT "userId"
        FROM sessions 
        WHERE token = $1
    `, [token]);
}

export async function removeFollow(follower, following) {

    return connection.query(`
        DELETE FROM follows
        WHERE "follower" = $1 AND "following" = $2
    `, [follower, following]);
}