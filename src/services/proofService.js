const fs = require("fs");

const path = require("path");

const crypto = require("crypto");

const sdk = require("../../sdk");

const proofsDir =
  path.join(__dirname, "../../storage/proofs");

if(!fs.existsSync(proofsDir)){

  fs.mkdirSync(proofsDir, {
    recursive:true
  });
}

async function createProof(
  agent_name,
  memory_type,
  content
){

  const proof =
    await sdk.notarize({
      agent_name,
      memory_type,
      content
    });

  return proof;
}

function getAllProofs(){

  if(!fs.existsSync(proofsDir)){
    return [];
  }

  const files =
    fs.readdirSync(proofsDir);

  return files.map(file => {

    const filePath =
      path.join(proofsDir, file);

    return JSON.parse(
      fs.readFileSync(filePath)
    );
  });
}

function getProofById(proofId){

  const proofs =
    getAllProofs();

  return proofs.find(
    proof => proof.proofId === proofId
  );
}

function verifyProof(proofId){

  const proof =
    getProofById(proofId);

  if(!proof){

    return {
      success:false,
      message:"Proof not found"
    };
  }

  const recalculatedHash =
    crypto
      .createHash("sha256")
      .update(JSON.stringify({
        agent_name: proof.agent_name,
        memory_type: proof.memory_type,
        content: proof.content
      }))
      .digest("hex");

  const verified =
    recalculatedHash === proof.sha256;

  return {
    success:true,
    proofId,
    verified,
    originalHash: proof.sha256,
    recalculatedHash,
    status: verified
      ? "VERIFIED"
      : "TAMPERED"
  };
}

module.exports = {
  createProof,
  getAllProofs,
  getProofById,
  verifyProof
};
