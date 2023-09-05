import express, { Request, Response, request } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool from './utils/db';


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());



/**
 * Este servicio permite el logeo de usuario
 */
app.post('/login', async (req, res) => {
    const { userName, userPassword } = req.body;
    try {
      const user = await pool.query('SELECT * FROM users WHERE userName = $1 AND userPassword = $2', [userName, userPassword]);
  
      if (user.rows.length === 0) {   
        res.json({ status: 1, message: 'Credenciales inválidas' });
      } else {
        res.json({ status : 0,  message: 'Inicio de sesión exitoso' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });


/**
 * Este servico devuelve los productos
 */
app.get('/product', async (req, res) => {
    try {
      const products = await pool.query('SELECT * FROM products');
      if (products.rows.length === 0) {
        res.json({ status: 1, message: 'No hay productos que mostrar' });
      } else {
        res.json({status : 200, products : products.rows});
      }
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });


  /**
   * Para obtener los usuarios
   */
  app.get('/user', async (req, res) => {
    try {
      const users = await pool.query('SELECT * FROM users');
      if (users.rows.length === 0) {
        res.json({ status: 1, message: 'No hay cheques que mostrar' });
      } else {
        res.json({status : 200, user : users.rows});
      }
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });


  /**
   * Para eliminar un producto
   */
  app.delete('/deleteProduct/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = 'DELETE FROM products WHERE id = $1';
      const result = await pool.query(query, [id]);
  
      if (result.rowCount === 1) {
        res.status(200).json({ status: 0, mensaje: 'Registro eliminado exitosamente' });
      } else {
        res.status(404).json({ status: 1, mensaje: 'Registro no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  });

// Para editar un registro por su ID
app.put('/updateProduct/:id', async (req, res) => {
  const { id } = req.params;
  const { productname, productdescription, productprice } = req.body;

  try {
    
    const query =
      'UPDATE products SET productname = $1, productdescription = $2, productprice = $3 WHERE id = $4';
    const result = await pool.query(query, [productname, productdescription, productprice, id]);

    if (result.rowCount === 1) {
      res.status(200).json({ status : 0, mensaje: 'Registro actualizado exitosamente' });
    } else {
      res.status(404).json({ status : 1, mensaje: 'Registro no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el registro:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
})




  /**
   * Para crear el producto
   */
  app.post('/createProduct', async( req, res)=>{

  const { productname, productdescription, productprice } = req.body;
  try {
    const query = 'INSERT INTO products (productname, productdescription, productprice) VALUES ($1, $2, $3)';
    const values = [productname, productdescription, productprice];

    await pool.query(query, values);

    res.status(201).json({ status: 0,  message: 'Producto agregado correctamente' });
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }

  })

  
  


app.listen(port, () => {
  console.log(`La API está escuchando en http://localhost:${port}`);
});



