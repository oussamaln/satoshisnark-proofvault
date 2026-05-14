const fs = require('fs');
const path = require('path');

async function saveProof(proof){

  const proofsDir = path.join(__dirname, '../../storage/proofs');

  if(!fs.existsSync(proofsDir)){
    fs.mkdirSync(proofsDir, { recursive: true });
  }

  const filename = `proof-${Date.now()}.json`;

  const filepath = path.join(proofsDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(proof, null, 2));

  return {
    success: true,
    localFile: filename
  };
}

module.exports = {
  saveProof
};
