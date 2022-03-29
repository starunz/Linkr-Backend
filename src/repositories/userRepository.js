import connection from "../db.js";

async function selectUser(userEmail) {
    return connection.query(`
        SELECT * 
        FROM users 
        WHERE email=$1
    `, [userEmail]);
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

async function getUsers(like){
    return connection.query(`
        SELECT id, "userName", "photoUrl" FROM users WHERE LOWER("userName") LIKE $1
    `, [`%${like}%`]);
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

    return {
        user, 
        userPosts
    }
}

export const userRepository = {
    selectUser,
    createUser,
    getUserDataById,
    getUsers,
    getUserPosts
}