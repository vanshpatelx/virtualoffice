export const query = {
    createTable: {
        users: `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
        avatars: `CREATE TABLE IF NOT EXISTS avatars (
                id SERIAL PRIMARY KEY,
                name VARCHAR(30) NOT NULL,
                url VARCHAR(150) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
        elements: `CREATE TABLE IF NOT EXISTS elements (
                id SERIAL PRIMARY KEY,
                url VARCHAR(150) NOT NULL,
                size VARCHAR(10) NOT NULL,
                static BOOLEAN NOT NULL,
                name VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
        userSpace: `CREATE TABLE IF NOT EXISTS userSpace (
                id SERIAL PRIMARY KEY,
                userid INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                spaceid VARCHAR(30) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`
    },
    insertQuery : {
        addUser: `INSERT INTO users (id, username, password, type) VALUES ($1, $2, $3, $4);`,
        addElementAdmin: `INSERT INTO elements (id, url, size, static, name) VALUES ($1, $2, $3, $4, $5);`,
        updateElementAdmin: `UPDATE elements SET url = $2 WHERE id = $1;`,
        addAvatar: `INSERT INTO avatars (id, name, url) VALUES ($1, $2, $3);`,
        addMap: `INSERT INTO Users (id, username, password, type) VALUES ($1, $2, $3, $4);`,
    },
    createSpace: `hello`
}