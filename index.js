const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/token", async (req, res) => {
  const email = "team@usetour.com";
  const licenseKey = process.env.COBROWSE_LICENSE;
  const demoid = req.query.cobrowseio_demo_id;

  const privateKey = await fs.readFileSync("./cobrowse-private-key.pem");
  const token = await jwt.sign(
    {
      displayName: "Team Tour",
      role: "agent",

      /* Use this or just options
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expires in 1 hour
      aud: "https://cobrowse.io",
      iss: licenseKey,
      sub: email,
      */
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
