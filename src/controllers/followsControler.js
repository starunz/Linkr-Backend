import { 
    createFollow, 
    selectFollowingsUsers,
    removeFollow,
} from "../repositories/followsRepository.js";

export async function getFollowingsByUserId(req, res) {
    const { id } = req.params;

    try {
        const { rows: followings } = await selectFollowingsUsers(id);

        const listFollowings = followings.map(following => {
            return following.following;
        });
        res.send(listFollowings);

    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
}

export async function insertFollow(req, res){
    const { follower, following } = req.body; 

    try {
        await createFollow(follower, following);
        res.sendStatus(201);

    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
}

export async function deleteFollow(req, res) {

    const { followingId } = req.params;
    const { userId } = res.locals;

    try {
        await removeFollow(userId, followingId);

        res.sendStatus(200);

    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
}