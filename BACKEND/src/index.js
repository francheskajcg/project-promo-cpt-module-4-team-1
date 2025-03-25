const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mysql = require("mysql2/promise");
const path = require("node:path");
const { v4: uuidv4 } = require("uuid");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Proyectos",
      version: "1.0.0",
      description: "Documentación de la API de proyectos",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: [__filename], // Indica dónde buscar los comentarios de Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };


const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25Mb' }));
app.set('view engine', 'ejs');
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Conexión con MySQL
async function getConnection() {
  const connectionData = {
    host: process.env["MYSQL_HOST"],
    port: process.env["MYSQL_PORT"],
    user: process.env["MYSQL_USER"],
    password: process.env["MYSQL_PASS"],
    database: process.env["MYSQL_SCHEMA"],
  };
  const connection = await mysql.createConnection(connectionData);
  await connection.connect();
  return connection;
}


// Servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// ENDPOINTS

// Obtener todos los proyectos

/**
 * @swagger
 * /api/autores:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
app.get("/api/autores", async (req, res) => {
  const conn = await getConnection();

  const [results] = await conn.query(`
    SELECT a.id, a.autor, a.job, a.image,
           p.name, p.slogan, p.technologies, p.repo, p.demo, p.description, p.photo
    FROM coolproject.autores a
    JOIN coolproject.proyectos p ON a.id = p.id;
  `);

  await conn.end();

  res.json({
    success: true,
    results,
  });
});

/**
  * @swagger
 * /api/autores:
 *   post:
 *     summary: Crear un autor
 *     tags: 
 *       - Autores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del proyecto
 *                 example: "Mi Proyecto"
 *               slogan:
 *                 type: string
 *                 description: Eslogan del proyecto
 *                 example: "Innovando el futuro"
 *               technologies:
 *                 type: string
 *                 description: Tecnologías utilizadas
 *                 example: "React, Node.js, MySQL"
 *               repo:
 *                 type: string
 *                 description: URL del repositorio
 *                 example: "https://github.com/user/proyecto"
 *               demo:
 *                 type: string
 *                 description: URL de la demo
 *                 example: "https://mi-proyecto-demo.com"
 *     responses:
 *       201:
 *         description: Autor creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cardURL:
 *                   type: string
 *                   description: URL del autor creado
 *                   example: "http://localhost:3000/autores/:uuid"
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
*/
app.post("/api/autores", async (req, res) => {
  const uuid = uuidv4();
  let conn;

  try {
    conn = await getConnection();
    await conn.beginTransaction();

    await conn.execute(
      `INSERT INTO proyectos (id, name, slogan, technologies, repo, demo, description, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuid, req.body.name, req.body.slogan, req.body.technologies, req.body.repo, req.body.demo, req.body.description, req.body.photo]
    );

    await conn.execute(
      `INSERT INTO autores (id, autor, job, image)
       VALUES (?, ?, ?, ?)`,
      [uuid, req.body.autor, req.body.job, req.body.image]
    );

    await conn.commit();
    res.json({ success: true, cardURL: `${req.protocol}://${req.hostname}:${port}/autores/${uuid}` });
  } catch (err) {
    if (conn) await conn.rollback();
    res.status(500).json({ success: false, message: err.toString() });
  } finally {
    if (conn) await conn.end();
  }
});

// API detalle (JSON)
app.get("/api/autores/:id", async (req, res) => {
  try {
    const conn = await getConnection();

    const [results] = await conn.query(
      `SELECT a.autor, a.job, a.image,
              p.name, p.slogan, p.technologies, p.repo, p.demo, p.description, p.photo
       FROM coolproject.autores AS a
       JOIN coolproject.proyectos AS p
       ON a.id = p.id
       WHERE a.id = ?`,
      [req.params.id]
    );

    await conn.end();

    if (results.length === 0) {
      return res.status(404).json({ message: "No encontrado" });
    }

    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

// EJS detalle
app.get('/autores/:uuid', async (req, res) => {
  try {
    const conn = await getConnection();
    const [results] = await conn.query(
      `SELECT a.autor, a.job, a.image,
              p.name, p.slogan, p.technologies, p.repo, p.demo, p.description, p.photo
       FROM coolproject.autores AS a
       JOIN coolproject.proyectos AS p
       ON a.id = p.id
       WHERE a.id = ?`,
      [req.params.uuid]
    );
    await conn.end();

    if (results.length === 0) {
      return res.status(404).send("Proyecto no encontrado");
    }

    const projectData = results[0];
    res.render('projectDetail', { projectData });
  } catch (err) {
    res.status(500).send("Error interno del servidor");
  }
});

// Estáticos
app.use('/styles', express.static(path.join(__dirname, 'static_detail_styles')));

app.use(express.static(path.join(__dirname, 'static_public_frontend')));

// React (SPA)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static_public_frontend', 'index.html'));
});

