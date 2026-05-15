const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const localProvider = require('./providers/localProvider');
const mockDacsProvider = require('./providers/mockDacsProvider');

const SDK_VERSION = '0.1.0';

async function notarize(data){

  const sha256 = crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');

  const proofId =
    `SSNARK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  const dacsResult =
    await mockDacsProvider.uploadProof(data);

  const proof = {
    success: true,
    proofId,
    ...data,
    sha256,
    storedAt: new Date().toISOString(),
    verificationStatus: 'COMPLETED',

    fileId: dacsResult.fileId,
    dacsId: dacsResult.dacsId,
    txHash: dacsResult.txHash,
    network: dacsResult.network
  };

  const localResult =
    await localProvider.saveProof(proof);

  return {
    ...proof,
    ...localResult
  };
}

function getProofs(){

  const proofsDir =
    path.join(__dirname, '../storage/proofs');

  if(!fs.existsSync(proofsDir)){
    return [];
  }

  const files =
    fs.readdirSync(proofsDir);

  return files.map(file => {

    const filepath =
      path.join(proofsDir, file);

    return JSON.parse(
      fs.readFileSync(filepath)
    );
  });
}

function verify(proofId){

  const proofs = getProofs();

  const proof =
    proofs.find(p => p.proofId === proofId);

  if(!proof){

    return {
      success: false,
      message: 'Proof not found'
    };
  }

  const recalculatedHash = crypto
    .createHash('sha256')
    .update(JSON.stringify({
      agent_name: proof.agent_name,
      memory_type: proof.memory_type,
      content: proof.content
    }))
    .digest('hex');

  const verified =
    recalculatedHash === proof.sha256;

  return {
    success: true,
    proofId,
    verified,
    originalHash: proof.sha256,
    recalculatedHash,
    status: verified ? 'VERIFIED' : 'TAMPERED'
  };
}

module.exports = {
  notarize,
  getProofs,
  verify,
  version: SDK_VERSION
};
