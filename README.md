# Crypto Trading Bot

This project is a crypto trading bot that monitors the price of various cryptocurrencies across multiple exchanges,
updates the order books, and identifies arbitrage opportunities.

# Setup ( dev )

1. Setup Init-service
- Config init-service

```
COINMARKETCAPKEY=""
```
- Run
```
cd init-service
docker-compose up --build
```


2. Alternative
- Config init-service

```
COINMARKETCAPKEY=""
MONGO_URI=""
PORT=3000
```
- Run
```
cd init-service
npm run start
```

3. Config coin-service

```
INITSERVICE_URL='http://localhost:3000'
COINS='coin1,coin2,coin3'
PORT=3001
```

4. Run

```
cd coin-service
npm run start
```

5. Access coin-service data on ```GET http://localhost:3001```
