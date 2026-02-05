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

CREATE TABLE category{
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    color VARCHAR(6) NOT NULL
}

CREATE TABLE memos(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES category(id),
    title VARCHAR(100) NOT NULL,
    description TEXT(max),
    yt_url VARCHAR (300),
    question ENUM('comment','ou','pourquoi','quoi','quand','qui'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
);
