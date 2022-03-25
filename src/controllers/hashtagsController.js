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