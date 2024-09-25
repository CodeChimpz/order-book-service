import {connect} from "./db/connections";
import {fetchAllCoins, fetchMarketData} from "./utils/cmc";
import {config} from "./config";
import {CoinsData} from "./types";
import {coinService} from "./coin/coin.service";

export async function MainJob () {
  console.log("Running daily update...");
  await connect()
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
  const data = await coinService.saveCoinsData(monitoredList);
}