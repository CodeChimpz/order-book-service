// Imports
import ccxt from "ccxt";
import bigDecimal from "js-big-decimal";
import cron from "cron";
import got from 'got';

// Config
export const config = {
  selectedCoins: ["altlayer", "mask-network", "open-campus", "zetachain", "blast", "illuvium", "biconomy", "arkham", "gmx", "space-id", "meme", "basic-attention-token", "celo", "green-metaverse-token"],
  selectedExchanges: ["binance", "bybit", "bingx", "bitget", "gateio", "kucoin", "kraken", "bitrue", "cryptocom", "okx", "poloniex", "upbit", "kuna", "mexc", "whitebit"],
  selectedGroups: ["USDT", "USDC", "FDUSD"],
  minVolume: 10000,
  minPercentage: 1,
};

// API Keys and URLs
export const baseMapUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?listing_status=active&start=1&limit=5000&sort=cmc_rank";
export const coinMarketCapKey = "ed614edf-4272-4d80-b753-7cfa51622173";
export const baseCoinUrl = (slug: string) => `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/market-pairs/latest?slug=${slug}&category=spot`;

// Utility functions
function collectVolume(arr: any) {
  const amountInUSDT = new bigDecimal(config.minVolume);
  const res = {
    price: new bigDecimal(0),
    volume: new bigDecimal(0),
    amount: new bigDecimal(0),
    depth: 0,
  };

  while (res.amount.compareTo(amountInUSDT) === -1 && arr[res.depth]) {
    const el = arr[res.depth];
    const price = new bigDecimal(el[0]);
    const volume = new bigDecimal(el[1]);

    res.volume = res.volume.add(volume);
    res.amount = volume.multiply(price).add(res.amount);
    res.price = res.amount.divide(res.volume);
    res.depth++;
  }
  return res;
}

// Initialize and filter coins from CoinMarketCap
async function fetchCoinList() {
  const response = await got.get(baseMapUrl, {
    headers: {
      'X-CMC_PRO_API_KEY': coinMarketCapKey
    }
  });

  const coinMap = JSON.parse(response.body);
  const filteredCoins = coinMap.filter((coin: any) => config.selectedCoins.includes(coin.slug));

  return filteredCoins;
}

async function fetchMarketData(coinSlug: string) {
  const url = baseCoinUrl(coinSlug);
  const response = await got.get(url);
  const marketPairs = JSON.parse(response.body).marketPairs;

  // Filter the market pairs based on volume, exchanges, and selected trading pairs
  const filteredPairs = marketPairs.filter((pair: any) => {
    const exchange = pair.exchangeName.toLowerCase();
    const volume = pair.volumeUsd;
    const tradingPair = pair.quoteCurrencySymbol;

    return config.selectedExchanges.includes(exchange) &&
      volume > config.minVolume &&
      config.selectedGroups.includes(tradingPair);
  });

  return filteredPairs;
}

// Fetch order book data for CEX exchanges
async function fetchOrderBook(exchangeSlug: string, marketPair: string) {
  try {
    const exchange = new ccxt.pro[exchangeSlug as keyof typeof ccxt.pro]();
    const orderBook = await exchange.fetchOrderBook(marketPair);

    return orderBook;
  } catch (error: any) {
    console.error(`Failed to fetch order book for ${exchangeSlug}: ${error.message}`);
    return null;
  }
}

// Monitoring logic
async function monitorPrices() {
  const coins = await fetchCoinList();

  for (const coin of coins) {
    const marketData = await fetchMarketData(coin.slug);
    const pricesList: { [key: string]: any } = {};

    for (const pair of marketData) {
      const exchangeSlug = pair.exchangeName.toLowerCase();
      const marketPair = `${coin.symbol}/${pair.quoteCurrencySymbol}`;
      const orderBook = await fetchOrderBook(exchangeSlug, marketPair);

      if (orderBook) {
        const buy = collectVolume(orderBook.bids);
        const sell = collectVolume(orderBook.asks);

        pricesList[coin.slug as string] = {
          [exchangeSlug]: {
            time: new Date(),
            buy: buy.price.getValue(),
            sell: sell.price.getValue(),
          }
        };
      } else {
        pricesList[coin.slug] = {
          [exchangeSlug]: {
            time: new Date(),
            buy: null,
            sell: null,
          }
        };
      }
    }

    // Log price comparison between the highest and lowest
    const lowestBuy = Math.min(...Object.values(pricesList[coin.slug]).map((data: any) => data.buy || Infinity));
    const highestSell = Math.max(...Object.values(pricesList[coin.slug]).map((data: any) => data.sell || -Infinity));

    if (lowestBuy !== Infinity && highestSell !== -Infinity) {
      const percentageDiff = ((highestSell - lowestBuy) / lowestBuy) * 100;
      console.log(`${coin.name.toUpperCase()} 🟠`);
      console.log(`Buy: ${lowestBuy}, Sell: ${highestSell}`);
      console.log(`Percentage Difference: ${percentageDiff.toFixed(2)}%`);
    }
  }
}

// Set up a cron job to refresh prices every 30 seconds
const priceMonitoringCron = new cron.CronJob('*/30 * * * * *', monitorPrices);

// Start the cron job
priceMonitoringCron.start();

// Add a daily cron to refresh CoinMarketCap data
const dailyUpdateCron = new cron.CronJob('0 0 * * *', async () => {
  const updatedCoins = await fetchCoinList();
  // If the config has changed, update the coin list for monitoring
  console.log("Daily CoinMarketCap data refresh complete.");
});

dailyUpdateCron.start();

