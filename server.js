
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(__dirname));

app.get("/api/health", (req, res) => {
  res.json({
    loja: "NOVAERA CITY STORE",
    status: "online",
    pix: "em configuracao"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("NOVAERA CITY STORE ONLINE!");
});
