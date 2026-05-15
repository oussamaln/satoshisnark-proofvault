require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const proofRoutes = require("./routes/proofRoutes");
const { initDacsClient } = require("./services/dacsService");
const sdk = require("../sdk");

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  // app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.static(path.join(__dirname, "public")));

  await initDacsClient();

  app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

  app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public/views/dashboard.html"));
  });

  app.use("/api", proofRoutes);
  app.get("/proof/:proofId", (req, res) => {

  const proof =
    sdk.getProofs().find(
      p => p.proofId === req.params.proofId
    );

  if(!proof){

    return res.send(`
      <h1 style="
        background:black;
        color:white;
        padding:40px;
        font-family:Arial;
      ">
        Proof Not Found
      </h1>
    `);
  }

  res.send(`

<!DOCTYPE html>

<html>

<head>

<title>${proof.proofId}</title>

<style>

body{
  background:#0b0f19;
  color:#00ff99;
  font-family:Arial;
  padding:40px;
}

.card{
  background:#121826;
  border:1px solid #00ff99;
  border-radius:12px;
  padding:30px;
  max-width:900px;
  margin:auto;
}

h1{
  margin-bottom:30px;
}

.label{
  color:#9ca3af;
  margin-top:20px;
}

.value{
  word-break:break-word;
  font-size:18px;
}

.status{
  color:#00ff99;
  font-weight:bold;
  font-size:22px;
  margin-top:20px;
}

pre{
  background:#0f172a;
  padding:20px;
  border-radius:10px;
  overflow:auto;
}

</style>

</head>

<body>

<div class="card">

<h1>${proof.proofId}</h1>

<div class="label">Agent</div>
<div class="value">${proof.agent_name}</div>

<div class="label">Memory Type</div>
<div class="value">${proof.memory_type}</div>

<div class="label">SHA256</div>
<div class="value">${proof.sha256}</div>

<div class="label">File ID</div>
<div class="value">${proof.fileId}</div>

<div class="label">DACS ID</div>
<div class="value">${proof.dacsId}</div>

<div class="label">TX Hash</div>
<div class="value">${proof.txHash}</div>

<div class="label">Stored At</div>
<div class="value">${proof.storedAt}</div>

<div class="label">Network</div>
<div class="value">${proof.network}</div>

<div class="status">
${proof.verificationStatus}
</div>

<h2>Content</h2>

<pre>${JSON.stringify(proof.content, null, 2)}</pre>

</div>

</body>

</html>

  `);
});

  app.listen(PORT, () => {
    console.log(`SatoshiSnark ProofVault running on port ${PORT}`);
  });
}

startServer();
