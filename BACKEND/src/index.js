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

app.post("/api/autores"),
  async (req, res) => {
    const uuid = window.crypto.randomUUID();
    console.log(uuid);

    // Condicionales para comprobar que vienen los param obligatorios

    try {
      const conn = await getConnection();

      const [result] = await conn.execute(
        `FROM coolproject.autores 
      JOIN coolproject.proyectos 
     ON autores.id = proyectos.id
      INSERT INTO (name, slogan, technologies, repo, demo, desc, autor, job, image, photo)  
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `[(req.body.name, req.body.slogan, req.body.technologies, req.body.repo, req.body.demo, req.body.desc, req.body.autor, req.body.job, req.body.image, req.body.photo)]
      );

      await conn.end();

      if (result.affectedRows === 1) {
        res.json({
          success: true,
          id: result.insertId,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Not inserted",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.toString(),
      });
    }
  };
