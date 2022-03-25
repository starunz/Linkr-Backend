import connection from '../db.js';

export async function insertHashtags(hashtags, postId){
    for (const hashtag of hashtags) {
        
        let hashtagId;
        try {
            hashtagId = await connection.query(`
                INSERT INTO hashtags 
                (name) 
                VALUES ($1)
                RETURNING id
            `, [hashtag]);
            hashtagId = hashtagId.rows[0].id;

        } catch (error) {
            if(error.message === 'duplicate key value violates unique constraint "hashtags_name_key"'){

                hashtagId = await connection.query(`
                    SELECT id FROM hashtags WHERE name = $1
                `, [hashtag]);
                hashtagId = hashtagId.rows[0].id;

            }else {return error.message}
        }

        await connection.query(`
            INSERT INTO hashtagsposts
            ("postId", "hashtagId")
            VALUES ($1, $2)
        `, [postId, hashtagId]);
    }
}

export async function getTrendingHashtags(req, res){
    try {
        const {rows: hashtags} = await connection.query(`
        SELECT hash.name, COUNT(hp.*)  
        FROM hashtagsPosts hp
        INNER JOIN hashtags hash on hash.id = hp."hashtagId"
        GROUP BY hash.name
        ORDER BY COUNT DESC, hash.name
        LIMIT 9;
        `);
        res.status(200).send(hashtags);
    } catch (error) {
        return error.message;
    }
}