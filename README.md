# Midnight Survey DApp

A production-ready privacy-preserving survey DApp built on the **Midnight Network** using **Compact smart contracts**, **React**, **Tailwind CSS**, **Express**, and **TypeScript**.

## Features

- **Wallet Authentication** - Connect your Midnight wallet to create and manage surveys
- **Create, Edit, Publish, Close Surveys** - Full survey lifecycle management
- **Multiple Question Types** - Short answer, multiple choice, rating, yes/no, and more
- **Zero-Knowledge Proof Verification** - Every response is verified using ZK proofs
- **Anonymous Encrypted Submissions** - Responses are encrypted and privacy-preserving
- **Nullifier-Based Deduplication** - One submission per eligible respondent
- **Private Responses on Midnight** - All data stored on-chain with privacy
- **Public Aggregated Analytics** - See response counts and statistics without compromising privacy
- **Responsive Modern UI** - Built with Tailwind CSS for any device
- **No SQL or External Database** - Pure blockchain storage

## Project Structure

```
midnight-survey-dapp/
├── packages/
│   ├── shared-types/       # Shared TypeScript types and interfaces
│   ├── shared-sdk/         # Midnight SDK utilities and contract interactions
│   ├── contracts/          # Compact smart contracts
│   │   └── contracts/      # .compact contract source files
│   ├── backend/            # Express API server
│   └── frontend/           # React + Vite + Tailwind CSS app
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Multi-service Docker setup
├── Dockerfile              # Multi-stage Docker builds
└── docs/                   # Documentation
```

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **Docker** (for containerized development)
- **Midnight Wallet** (for blockchain interactions)

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Build All Packages

```bash
pnpm build
```

### Run Development Servers

```bash
# Start backend (port 3001) and frontend (port 5173) concurrently
pnpm dev
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit          # Unit tests
pnpm test:integration   # Integration tests
pnpm test:contracts     # Smart contract tests
```

## Smart Contracts

The DApp uses three Compact smart contracts:

### Survey Registry
- Create, update, publish, close, and archive surveys
- Track survey state and response counts
- Verify survey ownership

### Response Registry
- Store encrypted responses on-chain
- Nullifier-based deduplication
- Prevent double submissions

### ZK Verifier
- Verify zero-knowledge proofs
- Response integrity verification
- Nullifier uniqueness verification

### Compile Contracts

```bash
pnpm contracts:compile
```

### Deploy Contracts

```bash
pnpm contracts:deploy:testnet
pnpm contracts:deploy:mainnet
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh tokens

### Surveys
- `POST /api/v1/surveys` - Create survey
- `GET /api/v1/surveys` - List surveys
- `GET /api/v1/surveys/:id` - Get survey
- `PUT /api/v1/surveys/:id` - Update survey
- `POST /api/v1/surveys/:id/publish` - Publish survey
- `POST /api/v1/surveys/:id/close` - Close survey
- `DELETE /api/v1/surveys/:id` - Delete survey

### Responses
- `POST /api/v1/surveys/:surveyId/responses` - Submit response
- `GET /api/v1/surveys/:surveyId/responses` - Get responses
- `GET /api/v1/surveys/:surveyId/analytics` - Get analytics

## Docker

### Development

```bash
docker-compose up -d
```

### Production Build

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## CI/CD

- **CI**: Lint, type-check, test, build, and security audit on every PR/push
- **Preview Deployments**: Automatic Vercel preview for develop branch
- **Production Deployments**: Automated deploy on tagged releases (v*)
- **Docker Images**: Published to GitHub Container Registry

### Release Process

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm version

# Create release
git add .
git commit -m "chore(release): vX.Y.Z"
git tag vX.Y.Z
git push && git push --tags
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Express.js, TypeScript |
| Blockchain | Midnight Network |
| Smart Contracts | Compact Language |
| SDK | Midnight JS SDK |
| ZK Proofs | Groth16 (via Midnight ledger) |
| Encryption | AES-256-GCM |
| Package Manager | pnpm |
| Containerization | Docker |

## Security

- All responses encrypted with AES-256-GCM
- Zero-knowledge proofs verify response integrity without revealing data
- Nullifier-based deduplication prevents double submissions
- No personally identifiable information stored on-chain
- Rate limiting on all API endpoints
- Helmet.js security headers
- CORS protection

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT
