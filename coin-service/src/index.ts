import * as cron from "cron";
import {CoinsData} from "./types";
import {mainService} from "./services/main.service";
import {fetchInitCoinData} from "./utils/init.service";

const orderBookUpdateJob = new cron.CronJob('*/30 * * * * *', async () => {
  console.log("Updating order books...");
  //todo:
  const coinsData: CoinsData = await fetchInitCoinData()
  for (const coinSlug in coinsData) {
    const markets = coinsData[coinSlug];
    for (const market of markets) {
      const updatedData = await mainService.updateOrderBook(coinSlug, market.marketPair, market.exchangeName);
      console.log(`Updated order book for ${coinSlug} on ${market.exchangeName}:`, updatedData);
    }
  }
});

orderBookUpdateJob.start();