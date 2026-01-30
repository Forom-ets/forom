CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_picture BYTEA,
    currency INTEGER DEFAULT 0,
    roles ENUM('admin', 'operator', 'user') DEFAULT 'user'
    likes INTEGER DEFAULT 0
);

CREATE TABLE memos(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    yesthebotworkstestxgfghxf
)