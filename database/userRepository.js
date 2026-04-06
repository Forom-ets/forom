import { runQuery } from './db.js';

const USER_FIELDS = 'id, username, email, jwt_secure_code, password_hash, role, currency';

async function ensureUserAuthSchema() {
  await runQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT');
  await runQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS jwt_secure_code TEXT');
  await runQuery('ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50)');
}

async function findUserById(id) {
  const result = await runQuery(
    `SELECT ${USER_FIELDS} FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findUserByEmail(email) {
  const result = await runQuery(
    `SELECT ${USER_FIELDS} FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  return result.rows[0] || null;
}

async function findUserByUsername(username) {
  const result = await runQuery(
    `SELECT ${USER_FIELDS} FROM users WHERE username = $1 LIMIT 1`,
    [username]
  );
  return result.rows[0] || null;
}

async function findUserByProvider(provider, providerId) {
  const result = await runQuery(
    `SELECT ${USER_FIELDS} FROM users WHERE auth_provider = $1 AND auth_provider_id = $2 LIMIT 1`,
    [provider, providerId]
  );
  return result.rows[0] || null;
}

async function usernameExists(username) {
  const result = await runQuery('SELECT 1 FROM users WHERE username = $1 LIMIT 1', [username]);
  return result.rowCount > 0;
}

async function createUserWithPassword({ username, email, passwordHash }) {
  const result = await runQuery(
    `INSERT INTO users (username, email, password_hash, role, is_claimed)
     VALUES ($1, $2, $3, 'associate', TRUE)
     RETURNING id, username, email, password_hash, role, currency`,
    [username, email, passwordHash]
  );
  return result.rows[0];
}

async function updateUserPassword({ userId, passwordHash }) {
  const result = await runQuery(
    `UPDATE users
     SET password_hash = $1, is_claimed = TRUE
     WHERE id = $2
     RETURNING id, username, email, password_hash, role, currency`,
    [passwordHash, userId]
  );
  return result.rows[0] || null;
}

async function setUserJwtSecureCode({ userId, jwtSecureCode }) {
  await runQuery('UPDATE users SET jwt_secure_code = $1 WHERE id = $2', [jwtSecureCode, userId]);
}

async function linkUserToProvider({ userId, provider, providerId }) {
  const result = await runQuery(
    `UPDATE users
     SET auth_provider = $1, auth_provider_id = $2, is_claimed = TRUE
     WHERE id = $3
     RETURNING id, username, email`,
    [provider, providerId, userId]
  );
  return result.rows[0] || null;
}

async function createUserWithProvider({ username, email, provider, providerId }) {
  const result = await runQuery(
    `INSERT INTO users (username, email, auth_provider, auth_provider_id, role, is_claimed)
     VALUES ($1, $2, $3, $4, 'associate', TRUE)
     RETURNING id, username, email, role, currency`,
    [username, email, provider, providerId]
  );
  return result.rows[0];
}

export {
  ensureUserAuthSchema,
  findUserById,
  findUserByEmail,
  findUserByUsername,
  findUserByProvider,
  usernameExists,
  createUserWithPassword,
  updateUserPassword,
  setUserJwtSecureCode,
  linkUserToProvider,
  createUserWithProvider,
};
