const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'Anahata4',
  port: 5432,
  database: 'modulo_5_leccion_1_ejercicio_1'
});

pool.query('SELECT * FROM clientes', (error, results) => {
  if (error) {
    console.log(error);
  } else {
    console.log(results.rows);
  }
});
//EVITAR INYECCION SQL
const userId = 'postgres1';
const username = 'postgres';

connection.query('SELECT * FROM users WHERE id = ? AND username = ?', [userId, username], function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();

