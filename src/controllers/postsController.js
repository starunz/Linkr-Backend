import urlMetadata from 'url-metadata';
import { insertHashtags } from './hashtagsController.js';
import addSpaceHashtagsStuck from '../utilityFunctions.js';
import { postsRepository } from '../repositories/postsRepository.js';

export async function publishPosts(req, res) {
    const {userId, link, description} = req.body;

    const descriptionResolve = addSpaceHashtagsStuck(description);

    const hashtags = (descriptionResolve.includes('#') ? (
        descriptionResolve.match(/#[^\s#\.\;]*/gmi).map(x => x.substr(1).toLowerCase()) || [] 
    ) : []);

    try {
        const {image, description: descriptionLink, title} = await urlMetadata(link);

        const { rows: postId } = await postsRepository.publishPosts(userId, link, descriptionResolve, descriptionLink, image, title);

        await insertHashtags(hashtags, postId[0].id);

        res.sendStatus(201);

    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
}

export async function getPosts(req, res) {

    const {hashtag} = req.query;
    let posts = null;
    let result = null;
    try {
        if(hashtag)
        {
            result = await postsRepository.getPostByHashtag(hashtag);
        }
        else
        {
            result = await postsRepository.getPosts();
        }

        posts = result.rows;
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
        const isLiked = await postsRepository.isLiked(postId, userId);
        
        if(isLiked.rows.length === 0) {
            
            await postsRepository.insertLike(userId, postId);

            return res.sendStatus(201)
        }

        await postsRepository.deleteLike(userId, postId);

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
        
        const likes = await postsRepository.selectLikes(postId);

        const userLike = await postsRepository.userLikes(postId, userId);

        const whoLiked = await postsRepository.whoLiked(postId);

        if(likes.rows.length === 0 ) { 
            return res.send([{ 
                postId: parseInt(postId), 
                count: 0, 
                isLiked: isLiked, 
                whoLiked: `Seja o primeiro <br/> a curtir!`}])
        }

        if (whoLiked.rows.length === 1) { 
            if (userLike.rows.length !== 0) { 
                isLiked = true;
                likes.rows[0].isLiked = isLiked;
                likes.rows[0].whoLiked = 'Você';

                return res.send(likes.rows)
            } else {
                likes.rows[0].isLiked = isLiked;
                likes.rows[0].whoLiked = `${whoLiked.rows[0].userName}`;

                return res.send(likes.rows)
            }
        }

        if (whoLiked.rows.length === 2) { 
            if (userLike.rows.length !== 0) { 
                isLiked = true;
                likes.rows[0].isLiked = isLiked;

                let other;
                if(whoLiked.rows[0].id === userId) {
                    other = whoLiked.rows[1].userName;
                } else {
                    other = whoLiked.rows[0].userName;
                }
            
                likes.rows[0].whoLiked = `Você e ${other}`;

                return res.send(likes.rows)
            } else { 
                likes.rows[0].isLiked = isLiked;
                likes.rows[0].whoLiked = `${whoLiked.rows[0].userName} e ${whoLiked.rows[1].userName}`;

                return res.send(likes.rows)
            }
        }

        if (whoLiked.rows.length > 2) { 
            if (userLike.rows.length !== 0) { 
                isLiked = true;
                likes.rows[0].isLiked = isLiked;
                
                let other;
                if (whoLiked.rows[0].id === userId) {
                    other = whoLiked.rows[1].userName;
                } else {
                    other = whoLiked.rows[0].userName;
                }

                likes.rows[0].whoLiked = `Você, ${other} e outras ${parseInt(likes.rows[0].count) - 2} pessoas`;

                return res.send(likes.rows)
            } else { 
                likes.rows[0].isLiked = isLiked;
                likes.rows[0].whoLiked = `${whoLiked.rows[0].userName}, ${whoLiked.rows[1].userName} e outras ${parseInt(likes.rows[0].count) - 2} pessoas`;

                return res.send(likes.rows)
            }
        }

    } catch (error) {
        res.sendStatus(500)
    }

}

export async function deletePosts(req, res) {
    const {id} = req.params;

    try {
        await postsRepository.deletePosts(id);
      
        res.sendStatus(200);

    } catch (error) {

        console.log(error.message);
        res.sendStatus(500);
    }
}

export async function updatePosts(req, res){
    const {id: postId} = req.params;
    const {description} = req.body;

    const descriptionResolve = addSpaceHashtagsStuck(description);

    const hashtags = (descriptionResolve.includes('#') ? (
        descriptionResolve.match(/#\w+/g).map(x => x.substr(1).toLowerCase()) || [] 
    ) : []);

    try {
        await postsRepository.deleteHashtagsByPostId(postId);

        await postsRepository.updatePosts(descriptionResolve, postId);
    
        await insertHashtags(hashtags, postId);

        res.sendStatus(200);

    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
}