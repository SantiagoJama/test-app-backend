const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testapp',
  password: 'santi',
  port: 5432, 
});

export default pool;