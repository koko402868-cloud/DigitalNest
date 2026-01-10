const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "catalog.json");

app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

function readCatalog() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveCatalog(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// USER + ADMIN (READ)
app.get("/api/catalog", (req, res) => {
  res.json(readCatalog());
});

// ADMIN ONLY (WRITE)
app.post("/api/catalog", (req, res) => {
  if (req.query.admin !== "1") {
    return res.status(403).send("Forbidden");
  }
  saveCatalog(req.body);
  res.sendStatus(200);
});

// root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://192.168.1.40:${PORT}`);
});
