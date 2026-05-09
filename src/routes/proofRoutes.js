const express = require("express");

const router = express.Router();

const {
  createProof,
  getAllProofs,
  verifyProof
} = require("../services/proofService");

const {
  healthCheck
} = require("../services/dacsService");

router.post("/notarize-memory", async (req, res) => {

  try {

    const {
      agent_name,
      memory_type,
      content
    } = req.body;

    if (!agent_name || !memory_type || !content) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const proof = await createProof(
      agent_name,
      memory_type,
      content
    );

    res.json(proof);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Internal notarization error"
    });
  }
});

router.get("/proofs", (req, res) => {
  res.json(getAllProofs());
});

router.get("/verify/:proofId", (req, res) => {

  const result = verifyProof(req.params.proofId);

  res.json(result);
});

router.get("/health", async (req, res) => {

  const health = await healthCheck();

  res.json(health);
});

module.exports = router;
