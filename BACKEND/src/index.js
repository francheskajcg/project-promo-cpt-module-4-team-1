const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mysql = require("mysql2/promise");
const path = require("node:path");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25Mb' }));
app.set('view engine', 'ejs');

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

// Crear proyecto
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
app.use(express.static(path.join(__dirname, 'static_detail_styles')));
app.use(express.static(path.join(__dirname, 'build')));

// React (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

