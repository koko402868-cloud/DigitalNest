const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "catalog.json");

app.use(express.json({limit:"50mb"}));
app.use(express.static("public"));

function readData(){
  if(!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE,"utf8"));
}
function writeData(data){
  fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2));
}

// GET catalog (all users)
app.get("/api/catalog",(req,res)=>{
  res.json(readData());
});

// SAVE catalog (ADMIN ONLY)
app.post("/api/catalog",(req,res)=>{
  const isAdmin = req.query.admin === "1";
  if(!isAdmin) return res.status(403).send("Forbidden");
  writeData(req.body);
  res.sendStatus(200);
});

// IMPORT JSON (ADMIN ONLY)
app.post("/api/import",(req,res)=>{
  const isAdmin = req.query.admin === "1";
  if(!isAdmin) return res.status(403).send("Forbidden");
  writeData(req.body);
  res.sendStatus(200);
});

// root
app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});

app.listen(PORT,"0.0.0.0",()=>{
  console.log(`Server running on http://192.168.1.40:${PORT}`);
});
