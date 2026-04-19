# Stellar EduCert DApp

**Stellar EduCert DApp** - Web-Based Chemistry Quiz and Decentralized Web3 Certification System

## Project Description

Stellar EduCert DApp is a decentralized smart contract solution built on the Stellar blockchain using Soroban SDK. It provides a secure, immutable platform for managing educational achievements. The system features a hybrid architecture: users take a chemistry quiz on the frontend with attempts securely recorded off-chain using Firebase. 

Upon achieving a passing score, the contract ensures that a permanent, verifiable NFT certificate is minted directly on the blockchain. Each certificate's visual assets and metadata are stored on Pinata (IPFS), ensuring data persistence, reliability, and eliminating reliance on centralized database providers for your credential assets.

## Project Vision

Our vision is to revolutionize educational credentialing in the digital age by:

- **Decentralizing Achievements**: Moving academic certificates from easily manipulated central servers to a global, distributed blockchain
- **Ensuring Ownership**: Empowering students to have complete control and ownership over their digital credentials through Web3 wallets
- **Guaranteeing Immutability**: Providing a permanent, tamper-proof record of passing the chemistry quiz that cannot be altered or deleted by third parties
- **Hybrid Efficiency**: Leveraging Firebase for fast frontend interactions and Stellar for high-value certificate minting
- **Building Trustless Systems**: Creating a platform where educational integrity is guaranteed by smart contract code

We envision a future where digital educational information is truly personal and sovereign, empowering individuals with complete autonomy over their digital assets.

## Key Features

### 1. **Automated Score Evaluation**

- Take interactive chemistry quizzes directly on the web
- Securely store user attempts and scores using Firebase
- Automated eligibility checking before triggering any blockchain transactions
- Seamless transition from learning to minting

### 2. **Blockchain Certificate Minting**

- Claim NFT certificates with just one function call upon passing
- Persistent storage of the credential on the Stellar blockchain
- Automated integration with connected Web3 wallets
- Secure and fast transaction finality

### 3. **Decentralized Asset Storage**

- Certificate images are hosted via Pinata (IPFS)
- Permanent asset links that cannot go offline
- Clean integration between the Soroban contract and IPFS CIDs
- Tamper-proof visual representation of achievements

### 4. **Transparency and Security**

- Fetch and view all earned certificates in a single call
- Blockchain-based verification of all claimed NFTs
- Immutable records of student accomplishments
- Protected against unauthorized modifications or fake certificates

### 5. **Stellar Network Integration**

- Leverages the high speed and low cost of Stellar
- Built using the modern Soroban Smart Contract SDK
- Scalable architecture for growing educational platforms
- Interoperable with other Stellar-based services and wallets

## Contract Details

Contract Address: CAKJABXDJCQZ7F73UOMBEJUMAVZOLUPSLG6TE5HH4F7AJAYUQTIPA2LA
  ![alt text](smartcontract.png)

## Frontend Preview

![alt text](frontend.png)

## Future Scope

### Short-Term Enhancements

1. **Dynamic Metadata**: Update IPFS metadata to include specific quiz metrics (time taken, score)
2. **Leaderboard System**: Add a frontend ranking board utilizing Firebase data
3. **Mobile Optimization**: Extend support for seamless mobile browser experiences
4. **Enhanced UI/UX**: Implement advanced animations for the certificate claiming process

### Medium-Term Development

5. **Multi-Subject Support**: Expand the contract to issue distinct NFTs for different subjects
   - Distinct IPFS folders for Physics, Biology, etc.
   - Subject-based metadata tags
   - Specific quiz requirements for each category
6. **Social Sharing System**: Bridge to easily share the verified NFT to LinkedIn or Twitter
7. **Wallet-less Onboarding**: Implement account abstraction so students don't need to manage private keys manually
8. **Inter-Contract Integration**: Allow other educational DApps to verify a student's certificate from this contract

### Long-Term Vision

9. **Cross-Chain Synchronization**: Extend credential storage to multiple blockchain networks
10. **Decentralized UI Hosting**: Host the entire frontend application on IPFS
11. **Learn-to-Earn**: Optional tokenized rewards for students who consistently achieve high scores
12. **Privacy Layers**: Implement zero-knowledge proofs for private score verification
13. **DAO Governance**: Community-driven educational curriculum improvements
14. **Identity Management**: Integration with decentralized identity (DID) systems for student IDs

### Enterprise Features

15. **Institutional Verification**: Adapt the system for schools to run their own nodes and verify credentials
16. **Immutable Auditing**: Create time-locked logs for academic audit purposes
17. **Automated Reporting**: Automatic triggers for periodic school performance reporting
18. **Multi-Language Support**: Expand accessibility for international students

---

## Technical Requirements

- Soroban SDK
- Rust programming language
- Stellar blockchain network
- Firebase (Cloud Firestore)
- Pinata IPFS
- Node.js & React/Vite

## Getting Started

Deploy the smart contract to Stellar's Soroban network and interact with it using the main functions:

- `claim_certificate()` - Mint a new NFT certificate and bind the IPFS CID to your wallet upon passing
- `get_all_certificates()` - Retrieve all earned certificates from the contract

---

**Stellar EduCert DApp** - Securing Educational Achievements on the Blockchain