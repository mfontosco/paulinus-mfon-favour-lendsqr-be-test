# Demo Credit Wallet Service – Lendsqr Assessment

This is an MVP wallet API built in Node.js with TypeScript, KnexJS, and MySQL.

## Features
-  User account creation with blacklist validation via Lendsqr Adjutor Karma API
-  Fund wallet
-  Transfer funds between wallets
- Withdraw from wallet
-  Unit tested with Jest
- Transaction-safe operations
-  Centralized logging with Winston
-  Modular folder structure

## Tech Stack
- Node.js (LTS)
- TypeScript
- MySQL
- Knex.js
- Jest
- Express.js

## API Endpoints
| Method | Endpoint              | Description                   |
|--------|-----------------------|-------------------------------|
| POST   | `/api/users`          | Create user                   |
| POST   | `/api/wallet/fund`    | Fund wallet                   |
| POST   | `/api/wallet/transfer`| Transfer between users        |
| POST   | `/api/wallet/withdraw`| Withdraw from wallet          |

## ER Diagram
https://erd.dbdesigner.net/designer/schema/1754165745-lendsqr-wallet-service

## Setup

git clone https://github.com/mfontosco/paulinus-mfon-favour-lendsqr-be-test.git

cd paulinus-mfon-favour-lendsqr-be-test

cp .env.example .env

npm install

npm run migrate

npm run dev
