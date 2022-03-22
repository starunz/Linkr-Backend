import bcrypt from 'bcrypt';
import connection from '../db.js';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(`
      INSERT INTO 
        users(email, password, "userName", "photoUrl") 
      VALUES ($1, $2, $3, $4)
    `, [ user.email, passwordHash, user.username, user.photoUrl ])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
