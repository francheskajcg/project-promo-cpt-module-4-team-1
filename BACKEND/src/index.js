const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mysql = require("mysql2/promise");

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

// Configuración del servidor
const app = express();

app.use(cors());
app.use(express.json());

// Arrancamos el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port <http://localhost:${port}>`);
});

app.get("/api/autores", async (req, res) => {
  const conn = await getConnection();

  const [results] = await conn.query(`SELECT * 
FROM coolproject.autores 
 JOIN coolproject.proyectos 
ON autores.id = proyectos.id;`);

  await conn.end();

  const numOfElements = results.length;

  res.json({
    info: { count: numOfElements },
    results: results,
  });
});

const { v4: uuidv4 } = require('uuid');

app.post("/api/autores", async (req, res) => {
  const uuid = uuidv4();
  let conn;

  // Validación de campos obligatorios
  if (
    !req.body.name ||
    !req.body.slogan ||
    !req.body.technologies ||
    !req.body.repo ||
    !req.body.demo ||
    !req.body.desc ||
    !req.body.autor ||
    !req.body.job ||
    !req.body.image ||
    !req.body.photo
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    conn = await getConnection();
    await conn.beginTransaction(); // Iniciar transacción

    // Insertar en "proyectos"
    await conn.execute(
      `INSERT INTO proyectos (id, name, slogan, technologies, repo, demo, desc, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuid, req.body.name, req.body.slogan, req.body.technologies, req.body.repo, req.body.demo, req.body.desc, req.body.photo]
    );

    // Insertar en "autores"
    await conn.execute(
      `INSERT INTO autores (id, autor, job, image)
       VALUES (?, ?, ?, ?)`,
      [uuid, req.body.autor, req.body.job, req.body.image]
    );

    await conn.commit(); // Confirmar transacción
    res.json({ success: true, id: uuid });
  } catch (err) {
    if (conn) await conn.rollback(); // Revertir transacción en caso de error
    res.status(500).json({ success: false, message: err.toString() });
  } finally {
    if (conn) await conn.end(); // Cerrar conexión
  }
});