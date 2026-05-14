const express = require("express");

const router = express.Router();

const sdk = require("../../sdk");

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

    const proof = await sdk.notarize({
      agent_name,
      memory_type,
      content
    });

    res.json(proof);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Internal notarization error"
    });
  }
});

router.get("/proofs", (req, res) => {

  const proofs = sdk.getProofs();

  res.json(proofs);
});

router.get("/verify/:proofId", (req, res) => {

  const result =
    sdk.verify(req.params.proofId);

  res.json(result);
});

router.get("/health", async (req, res) => {

  const health =
    await healthCheck();

  res.json({
    ...health,
    sdkVersion: sdk.version
  });
});

module.exports = router;
