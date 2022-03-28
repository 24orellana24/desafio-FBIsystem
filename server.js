const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const secretKey = "key fbi system 1.0."
const agentes = require("./data/agentes.js")

app.use(express.static("data"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
})

app.get("/SignIn", (req, res) => {
  const { email, password } = req.query;
  const agente = agentes.results.find((a) => a.email == email && a.password == password);

  if (agente) {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 120,
        data: agente,
      },
      secretKey
    );
    res.send(`
      <a href="/Dashboard?token=${token}"> <h2 style="text-align:center"> Ir al Dashboard </h2> </a>
      <script>
        localStorage.setItem("token", JSON.stringify("${token}"))
      </script>
    `);
  } else {
    res.send(`<h2 style="text-align:center"> Usuario o contraseña incorrecta </h2`);
  }
})

app.get("/Dashboard", (req, res) => {
  let { token } = req.query;
  jwt.verify(token, secretKey, (err, decoded) => {
    err
    ? res.status(401).send({
      error: "401 No autorizado",
      message: err.message,
    })
    :
    res.send(`
      <h2 style="text-align:center"> &#128526 Bienvenido a tu Dashboard agente... ${decoded.data.email} </h2>
    `);
  });
});

app.listen(3000, () => console.log("Servidor activo en puerto 3000"))