const mysql = require('mysql2/promise');

module.exports.pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'social_network',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// execute a query
module.exports.queryDatabase = async (query) => {
    const connection = await pool.getConnection();
    return connection.execute(query);
}



