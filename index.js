const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const app = express();
const port = 3000; // Puerto en el que se ejecutará el servidor
const router = express.Router();
// Configuración de Handlebars
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

// Configuración de bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Anahata4',
    port: 5432,
    database: 'modulo_5_leccion_1_ejercicio_1'
});

// Endpoint para mostrar la página principal
app.get('/', (req, res) => {
  pool.query('SELECT * FROM clientes', (error, results) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.render('home', { clientes: results.rows });
    }
  });
});



// Endpoint para crear un nuevo registro
app.post('/clientes', (req, res) => {
  const { nombre, rut, edad } = req.body;

  if (!nombre || !rut || !edad) {
    res.status(400).send('Faltan datos obligatorios');
  } else {
    pool.query('INSERT INTO clientes (nombre, rut, edad) VALUES ($1, $2, $3)', [nombre, rut, edad], (error, results) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res.redirect('/');
      }
    });
  }
});

// Endpoint para modificar un registro

app.post('/clientes/modificar', (req, res) => {
    const { rut, nombre, 'nombre-actual': nombreActual } = req.body;
  
    if (!rut || !nombre || !nombreActual) {
      res.status(400).send('Faltan datos obligatorios');
    } else {
      pool.query('UPDATE clientes SET nombre = $1 WHERE rut = $2 AND nombre = $3', [nombre, rut, nombreActual], (error, results) => {
        if (error) {
          res.status(500).send(error.message);
        } else {
          res.redirect('/');
        }
      });
    }
});

// Endpoint para eliminar un registro
app.post('/clientes/eliminar', (req, res) => {
    const rut = req.body.rut;
  
    if (!rut) {
      res.status(400).send('Falta el RUT del cliente a eliminar');
    } else {
      pool.query('DELETE FROM clientes WHERE rut = $1', [rut], (error, results) => {
        if (error) {
          res.status(500).send(error.message);
        } else {
          res.redirect('/');
        }
      });
    }
  });

// Endpoint para buscar un cliente por RUT
app.get('/clientes/buscar', (req, res) => {
  const rut = req.query.rut;
  
  if (!rut) {
    res.status(400).send('Falta el RUT del cliente a buscar');
  } else {
    pool.query('SELECT * FROM clientes WHERE rut = $1', [rut], (error, results) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        if (results.rows.length === 0) {
          res.status(404).send('Cliente no encontrado');
        } else {
          res.render('buscar-cliente', { clienteEncontrado: results.rows[0] });
        }
      }
    });
  }
});

// Endpoint para buscar un cliente por edad
app.get('/clientes/buscaredad', (req, res) => {
  const edad = req.query.edad;
  
  if (!edad) {
  res.status(400).send('Falta la edad del cliente a buscar');
  } else {
  pool.query('SELECT * FROM clientes WHERE edad = $1', [edad], (error, results) => {
  if (error) {
  res.status(500).send(error.message);
  } else {
  if (results.rows.length === 0) {
  res.status(404).send('No hay clientes con la edad indicada');
  } else {
  res.render('buscar-edad', { clientesEncontrados: results.rows });
  }
  }
  });
  }
  });
  
  // Nuevo endpoint para mostrar la vista de búsqueda por edad
  app.get('/clientes/buscar-edad', (req, res) => {
  res.render('buscar-edad');
  });


// Endpoint para buscar clientes por rango de edad
app.get('/clientes/buscarPorRangoEdad', (req, res) => {
  const edadMin = req.query.edadMin;
  const edadMax = req.query.edadMax;

  if (!edadMin || !edadMax) {
    res.status(400).send('Faltan la edad mínima o la edad máxima para realizar la búsqueda');
  } else {
    pool.query('SELECT * FROM clientes WHERE edad >= $1 AND edad <= $2', [edadMin, edadMax], (error, results) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        if (results.rows.length === 0) {
          res.status(404).send('No hay clientes que cumplan con ese criterio de búsqueda');
        } else {
          res.render('buscar-rango-edad', { clientesEncontrados: results.rows });
        }
      }
    });
  }
});

// Nuevo endpoint para mostrar la vista de búsqueda por rango de edad
app.get('/clientes/buscar-rango-edad', (req, res) => {
  res.render('buscar-rango-edad');
});


// Eliminar clientes por edad
app.delete('/clientes/eliminarPorEdad/:edad', (req, res) => {
  const { edad } = req.params;
  pool.query('DELETE FROM clientes WHERE edad = $1', [edad], (error, results) => {
    if (error) {
      res.status(404).send(error.message);
    } else {
      res.status(200).send(`Se eliminaron ${results.rowCount} cliente(s) con edad ${edad}`);
    }
  });
});

module.exports = router;

// Eliminar clientes por rango de edad
app.delete('/clientes/eliminarPorRangoEdad/:min/:max', (req, res) => {
  const { min, max } = req.params;
  pool.query('DELETE FROM clientes WHERE edad >= $1 AND edad <= $2', [min, max], (error, results) => {
    if (error) {
      res.status(404).send(error.message);
    } else {
      const eliminados = results.rowCount;
      if (eliminados > 0) {
        res.status(200).send(`Se eliminaron ${eliminados} cliente(s) con edad entre ${min} y ${max}`);
      } else {
        res.status(200).send(`No hay clientes que cumplan con el criterio`);
      }
    }
  });
});



// Inicialización del servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


