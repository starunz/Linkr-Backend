import connection from "../db.js";

async function insertHashtags(hashtag) {
    return connection.query(`
            INSERT INTO hashtags 
            (name) 
            VALUES ($1)
            RETURNING id
        `, [hashtag]);
}

async function selectHashtags(hashtag) {
    return connection.query(`
            SELECT id FROM hashtags WHERE name = $1
        `, [hashtag]);
}

async function insertHashtagsPosts(postId, hashtagId) {
    return connection.query(`
            INSERT INTO hashtagsposts
            ("postId", "hashtagId")
            VALUES ($1, $2)
        `, [postId, hashtagId]);
}

async function getTrendingHashtags() {
    return connection.query(`
            SELECT hash.name, COUNT(hp.*)  
            FROM hashtagsPosts hp
            INNER JOIN hashtags hash on hash.id = hp."hashtagId"
            GROUP BY hash.name
            ORDER BY COUNT DESC, hash.name
            LIMIT 9;
        `);
}

export const hashtagsRepository = {
    insertHashtags,
    selectHashtags,
    insertHashtagsPosts,
    getTrendingHashtags
}