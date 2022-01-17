const Pool = require('pg').Pool

const pool = new Pool({
  user: 'doadmin',
  host: 'medicall-db-postgresql-do-user-10631281-0.b.db.ondigitalocean.com',
  database: 'test-db',
  password: 'nERrFZiYlYgSGqva',
  port: 25060,
  ssl: { rejectUnauthorized: false }
})

module.exports = pool;