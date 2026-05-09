const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { generateSHA256 } = require("../utils/hash");
const { uploadToDacs, getDacsStatus } = require("./dacsService");

const dbPath = path.join(__dirname, "../db/database.json");

const storageDir = path.join(__dirname, "../../storage/proofs");

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

async function createProof(agent_name, memory_type, content) {

  const createdAt = new Date().toISOString();

  const rawData = {
    agent_name,
    memory_type,
    content,
    createdAt
  };

  const serializedContent = JSON.stringify(rawData, null, 2);

  const sha256 = generateSHA256(serializedContent);

  const filename = `proof-${Date.now()}.json`;

  const filePath = path.join(storageDir, filename);

  fs.writeFileSync(filePath, serializedContent);

  const buffer = Buffer.from(serializedContent);

  const upload = await uploadToDacs(buffer, filename);

  const status = await getDacsStatus(upload.fileId);

  const proof = {
    success: true,
    proofId: "SSNARK-" + uuidv4().slice(0, 8).toUpperCase(),
    agent_name,
    memory_type,
    sha256,
    fileId: upload.fileId,
    dacsId: status.dacsId || null,
    txHash: status.txHash || null,
    storedAt: createdAt,
    verificationStatus: status.status,
    network: "Xenea Ubusuna Testnet",
    localFile: filename
  };

  const db = readDB();

  db.proofs.unshift(proof);

  writeDB(db);

  return proof;
}

function getAllProofs() {
  return readDB().proofs;
}

function verifyProof(proofId) {

  const db = readDB();

  const proof = db.proofs.find(p => p.proofId === proofId);

  if (!proof) {
    return {
      success: false,
      message: "Proof not found"
    };
  }

  const filePath = path.join(storageDir, proof.localFile);

  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      message: "Stored proof file missing"
    };
  }

  const fileContent = fs.readFileSync(filePath, "utf8");

  const recalculatedHash = generateSHA256(fileContent);

  const verified = recalculatedHash === proof.sha256;

  return {
    success: true,
    proofId,
    verified,
    originalHash: proof.sha256,
    recalculatedHash,
    status: verified ? "VERIFIED" : "TAMPERED"
  };
}

module.exports = {
  createProof,
  getAllProofs,
  verifyProof
};
