import { hashtagsRepository } from '../repositories/hashtagsRepository.js';

export async function insertHashtags(hashtags, postId){
    for (const hashtag of hashtags) {
        if (hashtag === '') continue;
         
        let hashtagId;
        try {
            hashtagId = await hashtagsRepository.insertHashtags(hashtag);
            hashtagId = hashtagId.rows[0].id;

        } catch (error) {
            if(error.message === 'duplicate key value violates unique constraint "hashtags_name_key"'){

                hashtagId = await hashtagsRepository.selectHashtags(hashtag);
                hashtagId = hashtagId.rows[0].id;

            }else {return error.message}
        }

        await hashtagsRepository.insertHashtagsPosts(postId, hashtagId);
    }
}

export async function getTrendingHashtags(req, res){
    try {
        const {rows: hashtags} = await hashtagsRepository.getTrendingHashtags();
        
        res.status(200).send(hashtags);
    } catch (error) {
        return error.message;
    }
}