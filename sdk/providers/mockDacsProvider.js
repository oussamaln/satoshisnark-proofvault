const { v4: uuidv4 } = require('uuid');

async function uploadProof(proof){

  const fileId = uuidv4();

  return {
    success: true,
    fileId,
    dacsId: `QmMockDacsCID${fileId.slice(0,8)}`,
    txHash: `0xMockTxHash${fileId.slice(0,8)}`,
    network: 'Xenea Ubusuna Testnet'
  };
}

module.exports = {
  uploadProof
};
