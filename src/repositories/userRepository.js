import connection from "../db.js";

async function selectUser(userEmail) {
    return connection.query(`
        SELECT * 
        FROM users 
        WHERE email=$1
    `, [userEmail]);
}

async function verifyUserName(userName) {
    return connection.query(`
        SELECT  *
        FROM users
        WHERE "userName" = $1
    `, [userName]);
}

async function createUser(user, passwordHash) {
    return connection.query(`
      INSERT INTO 
        users(email, password, "userName", "photoUrl") 
      VALUES ($1, $2, $3, $4)
    `, [user.email, passwordHash, user.username, user.photoUrl]);
}

async function getUserDataById(id) {
    return connection.query(`
      SELECT * FROM users WHERE $1 = users.id
  `, [id]);
}

async function getUsers(id, username)
{
    const {rows: following} = await connection.query(`     
      SELECT "userName", u.id, u."photoUrl"
      FROM users u
      INNER JOIN follows f on u.id = f.following
      WHERE follower = $1 AND "userName" like $2
      ORDER BY "userName" ASC; 
    `,[id, `%${username}%`]);

    let followingIds = [];
    following.forEach(follow => followingIds.push(follow.id));
    followingIds.push(id);
    followingIds = followingIds.join(", ");
    
    const {rows: notFollowing} = await connection.query(`     
    SELECT u."userName", u.id, u."photoUrl"
     FROM users u 
     WHERE u.id
      NOT IN ( ${followingIds} )
      AND "userName" like $1
     order by "userName";
    `,[`%${username}%`]);

    return {following, notFollowing};

}

async function getUserPosts(id){
    const user = await connection.query(`
      SELECT users."userName", users."photoUrl"
      FROM users
      WHERE users.id = $1;
    `, [id]);

    const userPosts = await connection.query(`
      SELECT posts.*, users."photoUrl", users."userName" author
      FROM posts
      JOIN users ON users.id = posts."userId" 
      WHERE "userId" = $1;
    `, [id]);

    const userReposts = await connection.query(`
      SELECT 
      p.id, p.link, p.description, p."userId", p."imageLink", p."titleLink", p."descriptionLinK", re."createDate", 
      upost."userName" author, upost."photoUrl", re."userId" "userRepostId", ur."userName" "userRepostName"
      FROM reposts re
      JOIN posts p ON p.id = re."postId"
      JOIN users ur ON ur.id = re."userId"
      JOIN users upost ON upost.id = p."userId"
      WHERE re."userId" = $1
    `, [id]); 

    return {
        user, 
        userPosts,
        userReposts
    }
}

export const userRepository = {
    selectUser,
    verifyUserName,
    createUser,
    getUserDataById,
    getUsers,
    getUserPosts
}