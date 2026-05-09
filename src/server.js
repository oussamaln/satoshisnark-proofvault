require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const proofRoutes = require("./routes/proofRoutes");
const { initDacsClient } = require("./services/dacsService");

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

  app.listen(PORT, () => {
    console.log(`SatoshiSnark ProofVault running on port ${PORT}`);
  });
}

startServer();
