import {fetchAllCoins, fetchMarketData} from "../utils/coinMarketCap";
import {collectVolume} from "../utils/bigDecimal";
import {config} from "../config/index";
import {fetchOrderBook} from "../utils/ccxt";
import {CoinsData, OrderBookLocal} from "../types";
import {coinService} from "./coin.service";

export class MainService {

  async initializeCoinsData(): Promise<CoinsData> {
    const allCoins = await fetchAllCoins();

    // Filter based on selected coins
    const filteredCoins = allCoins.data.filter((coin: any) =>
      config.selectedCoins.includes(coin.slug)
    );

    // Fetch market data in parallel
    const marketDataPromises = filteredCoins.map((coin: any) =>
      fetchMarketData(coin.slug)
    );

    const marketDataResults = await Promise.all(marketDataPromises);

    // Process market data and filter markets based on exchanges, volume, and trading pairs
    const monitoredList: CoinsData = {};

    filteredCoins.forEach((coin: any, index: number) => {
      const marketData = marketDataResults[index];

      const filteredMarkets = marketData.data.marketPairs.filter((market: any) =>
        config.selectedExchanges.includes(market.exchangeName) &&
        market.volumeUsd > config.minVolume &&
        config.selectedGroups.includes(market.quoteSymbol)
      );

      monitoredList[coin.slug] = filteredMarkets;
    });

    // Save the data to MongoDB
    await coinService.saveCoinsData(monitoredList);

    return monitoredList;
  }

  async updateOrderBook(coinSlug: string, marketPair: string, exchangeSlug: string): Promise<OrderBookLocal> {
    const orderBook = await fetchOrderBook(exchangeSlug, marketPair);
    const buyVolume = collectVolume(orderBook.bids as number[][]);
    const sellVolume = collectVolume(orderBook.asks as number[][]);

    return {
      buy: buyVolume.price.getValue(),
      sell: sellVolume.price.getValue(),
      time: new Date(),
    };
  }
}

export const mainService = new MainService()
