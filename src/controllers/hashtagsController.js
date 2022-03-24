import connection from '../db.js';

export async function insertHashtags(hashtags, postId){
    for (const hashtag of hashtags) {

        try {
            await connection.query(`
                INSERT INTO hashtags 
                (name) 
                VALUES ($1)
            `, [hashtag]);
        } catch (error) {
            if(error.message === 'duplicate key value violates unique constraint "hashtags_name_key"'){
                continue;
            }else {
                return error.message;
            }
        }

        const {rows: hashtagId} = await connection.query(`
            SELECT MAX(id) FROM hashtags
        `);

        await connection.query(`
            INSERT INTO hashtagsposts
            ("postId", "hashtagId")
            VALUES ($1, $2)
        `, [postId, hashtagId[0].max]);
    }
}