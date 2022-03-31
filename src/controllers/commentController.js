import { commentRepository } from "../repositories/commentRepository.js";

export async function insertComment(req, res){
    const { postId } = req.params;
    const { userId, text } = req.body;

    try {
        await commentRepository.createComment(userId, postId, text);

        res.sendStatus(201);

    } catch (error) {
        res.sendStatus(500);
    }
}

export async function getComments(req, res){
    const { postId } = req.params;
    
    try {
        const comments = await commentRepository.getComments(postId);
        
        res.send(comments.rows);

    } catch (error) {
        res.sendStatus(500);
    }
}