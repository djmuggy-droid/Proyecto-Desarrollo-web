const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});

connection.connect((error) => {
  if (error) {
    console.error('Error al conectar con la base de datos:', error);
    return;
  }
  console.log('Conectado correctamente a la base de datos MotoStore');
});

module.exports = connection;
