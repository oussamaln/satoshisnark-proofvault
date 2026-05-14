# ProofVault SDK

Verifiable AI memory infrastructure SDK built for decentralized persistence and autonomous agent verification.

## Features

- AI memory notarization
- SHA256 integrity validation
- Persistent proof receipts
- Provider abstraction architecture
- Future-ready Xenea DACS integration

---

## Installation

```bash
npm install @satoshisnark/proofvault-sdk
```

---

## Usage

```javascript
const sdk = require('@satoshisnark/proofvault-sdk');

const proof = await sdk.notarize({
  agent_name: 'Th3ros-Agent',
  memory_type: 'execution_log',
  content: {
    task: 'Analyze AI execution'
  }
});

console.log(proof);
```

---

## SDK Methods

### notarize()

Generate verifiable proof receipts.

### verify()

Verify proof integrity.

### getProofs()

Retrieve stored proofs.

---

## Architecture

Client
↓
ProofVault SDK
↓
Provider Layer
↓
Storage Backend
↓
Future Xenea DACS Persistence

---

## Version

Current SDK Version:
0.1.0
