// src/services/cryptoService.ts
import {fetchAllCoins, fetchMarketData} from "../utils/coinMarketCap";
import {collectVolume} from "../utils/bigDecimal";
import {config} from "../config/index";
import {fetchOrderBook} from "../utils/ccxt";

export async function initializeCoinsData() {
  const allCoins = await fetchAllCoins();

  // Filter based on selected coins
  const filteredCoins = allCoins.data.filter((coin: any) =>
    config.selectedCoins.includes(coin.slug)
  );

  const monitoredList: any = {};

  for (const coin of filteredCoins) {
    const marketData = await fetchMarketData(coin.slug);

    // Further filtering based on exchanges, volume, and trading pairs
    const filteredMarkets = marketData.data.marketPairs.filter((market: any) =>
      config.selectedExchanges.includes(market.exchangeName) &&
      market.volumeUsd > config.minVolume &&
      config.selectedGroups.includes(market.quoteSymbol)
    );

    monitoredList[coin.slug] = filteredMarkets;
  }

  return monitoredList;
}

export async function updateOrderBook(coinSlug: string, marketPair: string, exchangeSlug: string) {
  const orderBook = await fetchOrderBook(exchangeSlug, marketPair);
  const buyVolume = collectVolume(orderBook.bids as number[][]);
  const sellVolume = collectVolume(orderBook.asks as number[][]);

  return {
    buy: buyVolume.price.getValue(),
    sell: sellVolume.price.getValue(),
    time: new Date(),
  };
}
