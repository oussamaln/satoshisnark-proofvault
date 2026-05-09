const { v4: uuidv4 } = require("uuid");

let client = null;

async function initDacsClient() {
  if (process.env.DACS_API_KEY && process.env.DACS_API_KEY !== "waiting_for_key") {
    const sdk = await import("@xenea.io/dacs-sdk");
    const DacsClient = sdk.DacsClient;

    client = new DacsClient({
      baseURL: process.env.DACS_BASE_URL,
      apiKey: process.env.DACS_API_KEY,
    });

    console.log("[DACS] Live client initialized");
  } else {
    console.log("[DACS] Running in MOCK MODE (no API key)");
  }
}

async function uploadToDacs(buffer, filename) {
  if (!client) {
    return {
      mock: true,
      fileId: uuidv4(),
      message: "Mock upload successful. Awaiting real DACS API key."
    };
  }

  const result = await client.files.upload(buffer, filename, {
    tags: ["SatoshiSnark", "ProofVault", "AI-Memory"],
  });

  return result;
}

async function getDacsStatus(fileId) {
  if (!client) {
    return {
      fileId,
      filename: "mock.json",
      status: "COMPLETED",
      dacsId: "QmMockDacsCID" + fileId.slice(0, 8),
      txHash: "0xMockTxHash" + fileId.slice(0, 8),
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
  }

  return await client.files.getStatus(fileId);
}

async function healthCheck() {
  if (!client) {
    return {
      status: "mock-ok",
      service: "mock-dacs-gateway",
      dacs: { connected: false },
      xenea: { connected: false },
      timestamp: new Date().toISOString()
    };
  }

  return await client.health();
}

module.exports = {
  initDacsClient,
  uploadToDacs,
  getDacsStatus,
  healthCheck
};
