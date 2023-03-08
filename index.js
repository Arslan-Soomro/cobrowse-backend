const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require('dotenv').config()

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/token", async (req, res) => {
  const email = "arslanjs.dev@gmail.com";
  const licenseKey = process.env.COBROWSE_LICENSE;
  const demoid = req.query.cobrowseio_demo_id;

  const privateKey = await fs.readFileSync("./cobrowse-private-key.pem");
  const token = await jwt.sign(
    {
      displayName: email,
      role: "agent",
    },
    privateKey,
    {
      expiresIn: "1h",
      issuer: licenseKey,
      subject: email,
      audience: "https://cobrowse.io",
      algorithm: "RS256",
    }
  );
  console.log("Generated Token: ", token);
  res.json({ token: token });
});

app.listen(port, () => {
  console.log(`Cobrowse API Listening at ${port}`);
});
