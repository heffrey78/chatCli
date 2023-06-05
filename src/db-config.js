// db-config.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
});

module.exports = pool;
