# Crypto Trading Bot

This project is a crypto trading bot that monitors the price of various cryptocurrencies across multiple exchanges, updates the order books, and identifies arbitrage opportunities.

### Step 1: Clone the Repository

```
git clone https://github.com/your-username/crypto-trading-bot.git
```

### Step 2: Setup Environment Variables
Create a .env file in the root directory of your project:

COINMARKETCAPKEY=''
MONGO_URI=''

### Step 3: Build and Run with Docker Compose
To run the project using Docker Compose:

Build and start the containers:

```docker-compose up --build```

This will build the app image and start both the app and MongoDB containers.

### Step 4: Run Without Docker (Optional)

```
npm install
npm install -g tsx
tsx src/init.service.ts
```

### Project Structure
```
├── src
│   ├── config         # Config for CoinMarketCap API except for the APIKey
│   ├── db             # Db connection and schemas
│   ├── services       #
│   |   |── coin       # Service to save / retreive coin data from db 
│   |   |── main       # General shared app functionality and main functions used by jobs
│   ├── utils          # Various util functions for bigDecimal, ccxt, general formulas, coinmarketcap
│   ├── types          #       
│   └── init.service.ts       # Start the app and init db/jobs
│   └── job.ts         # Set up cron jobs for init/update coin data      
├── Dockerfile         # Docker image definition
├── docker-compose.yml # Docker Compose setup for app and MongoDB
├── .env               # Environment variables file
```

