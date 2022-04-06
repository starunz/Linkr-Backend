import connection from "../db.js";

async function verifyUser(email) {
    return connection.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
}

async function createSession(token, userId) {
    return connection.query(
        'INSERT INTO sessions (token, "userId") VALUES ($1, $2)',
        [token, userId]
    );
}

async function selectSessionByToken(token) {
    return connection.query(`
        SELECT * FROM sessions WHERE token = $1
    `, [token]);
}

export const authRepository = {
    verifyUser,
    createSession,
    selectSessionByToken,
}