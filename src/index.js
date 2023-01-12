const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

// Defining port
const PORT = process.env.PORT || 3333;

// Connecting with the DB
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const app = express();
app.use(express.json());
app.use(cors());

// *-- CRUD --*

// CREATE
app.post("/add", async (req, res) => {
  // const dt_nascimento = dayjs(dt_nascimento).format("YYYY-MM-DD")
  const {
    id_titulo,
    tx_nome,
    tx_sexo,
    tx_estado_civil,
    dt_nascimento,
    tx_telefone,
  } = req.body;
  try {
    const newTeacher = await pool.query(
      "INSERT INTO escola.professor(id_titulo, tx_nome, tx_sexo, tx_estado_civil, dt_nascimento, tx_telefone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id_titulo, tx_nome, tx_sexo, tx_estado_civil, dt_nascimento, tx_telefone]
    );
    return res.status(200).send("DEU CERTO! Professor(a) cadastrado(a) com sucesso. :D");
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// READ
app.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM escola.professor");
    return res.status(200).send(rows);
  } catch (err) {
    return res.status(400).send(err);
  }
});

// UPDATE
app.patch("/edit/:id_professor", async (req, res) => {
  const { id_professor } = req.params;
  const data = req.body;
  try {
    const updateTeacher = await pool.query(
      "UPDATE escola.professor SET id_titulo = ($1), tx_nome = ($2), tx_sexo = ($3), tx_estado_civil = ($4), dt_nascimento = ($5), tx_telefone = ($6) WHERE id_professor = ($7) RETURNING *",
      [
        data.id_titulo,
        data.tx_nome,
        data.tx_sexo,
        data.tx_estado_civil,
        data.dt_nascimento,
        data.tx_telefone,
        id_professor,
      ]
    );
    return res.status(200).send(updateTeacher.rows);
  } catch (err) {
    return res.status(400).send(err);
  }
});

// DELETE
app.delete("/delete/:id_professor", async (req, res) => {
  const { id_professor } = req.params;
  try {
    const deleteTeacher = await pool.query(
      "DELETE FROM escola.professor WHERE id_professor = ($1) RETURNING *",
      [id_professor]
    );
    return res.status(200).send("Professor(a) deletado(a) com sucesso! ;)");
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

app.listen(PORT, () => console.log(`Server ir running on ${PORT}`));
