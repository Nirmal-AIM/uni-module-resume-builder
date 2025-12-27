import mysql from 'mysql2/promise';

export const createMySQLConnection = async () => {
    return await mysql.createConnection({
        host: process.env.DB_HOST || 'srv1640.hstgr.io',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'u941670923_unisync',
        password: process.env.DB_PASSWORD || 'Unisync@123',
        database: process.env.DB_NAME || 'u941670923_unisync',
    });
};
