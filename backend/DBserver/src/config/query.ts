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
                size VARCHAR(10) NOT NULL UNIQUE,
                static BOOLEAN NOT NULL,
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
        addUser: `INSERT INTO Users (id, username, password, type) VALUES ($1, $2, $3, $4);`,
    },
    createSpace: `hello`
}


// INSERT INTO Space (name, dimensions, mapId) 
// VALUES ('string', '100x200', 'map1') 
// RETURNING id AS spaceId;


// // createSpace :
// 1. User Space DB
// 2. Space Element DB (Copy all element of MAP element DB)
// 3. space self


// // deleteSpace :
// 1. User Space DB
// 2. Space Element DB (delete)
// 3. space self