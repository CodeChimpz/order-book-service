import {fetchAllCoins, fetchMarketData} from "../utils/coinMarketCap";
import {collectVolume} from "../utils/bigDecimal";
import {config} from "../config/index";
import {fetchOrderBook} from "../utils/ccxt";
import {BestPricesResult, CoinsData, OrderBookLocal, PricesList} from "../types";
import {coinService} from "./coin.service";
import {CalcService} from "../utils/calc";

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
      const filteredMarkets = marketData.data.marketPairs.map((market: any) => ({
        ...market,
        exchangeName: market.exchangeName.toLowerCase()
      }))
        .filter((market: any) =>
          config.selectedExchanges.includes(market.exchangeName)
          && market.volumeUsd > config.minVolume
          && config.selectedGroups.includes(market.quoteSymbol)
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
      buy: Number(buyVolume.price.getValue()),
      buyVolume: Number(buyVolume.volume.getValue()),
      sell: Number(sellVolume.price.getValue()),
      sellVolume: Number(sellVolume.volume.getValue()),
      time: new Date(),
    };
  }

  getExtremePrices(slug: string, prices: OrderBookLocal[]): BestPricesResult {
    // Find the highest and lowest prices for the current coin
    const validPrices = prices.filter(data => data !== null && data.buy && data.sell);
    return this.getBestPrices(validPrices)
  }

  // Function to find the best buy and sell prices
  getBestPrices(pricesList: OrderBookLocal[]): BestPricesResult {
    let bestBuy: OrderBookLocal | null = null;
    let bestSell: OrderBookLocal | null = null;

    for (const market of pricesList) {

      if (!bestBuy || (market.buy !== null && market.buy < bestBuy.buy!)) {
        bestBuy = market;
      }

      if (!bestSell || (market.sell !== null && market.sell > bestSell.sell!)) {
        bestSell = market;
      }
    }

    if (!bestBuy || !bestSell) {
      throw new Error('No valid buy or sell prices found.');
    }

    const percentageDifference = CalcService.calculatePercentageDifference(+bestBuy.buy, +bestSell.sell);

    // Format the output
    return {
      bestBuy, bestSell, percentageDifference
    }
  }
}

export const mainService = new MainService()
