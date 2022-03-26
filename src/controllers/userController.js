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

export async function getUserDataById(req, res){

  const {id} = req.params;

  const {rows: user} = await connection.query(`
      SELECT * FROM users WHERE $1 = users.id
  `, [id]);
  if (user.length === 0) {
      return res.sendStatus(422);
  }

  delete(user[0].params);

  res.send(user[0]);
}

export async function getUsers(req, res){
  try{
    const {like} = req.query;

    const {rows: users} = await connection.query(`
        SELECT id, "userName", "photoUrl" FROM users WHERE LOWER("userName") LIKE $1
    `, [`%${like}%`]);
    
    return res.status(200).send(users);
  }
  catch(error)
  {
    return res.status(500).send(error.message);
  }
}
