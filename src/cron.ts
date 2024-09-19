import cron from "cron";
import {CoinsData} from "./types";
import {mainService} from "./services/main.service";
import {coinService} from "./services/coin.service";

const dailyUpdateJob = new cron.CronJob('0 0 * * *', async () => {
  console.log("Running daily update...");
  const data = await mainService.initializeCoinsData();
  console.log(data);
});

const orderBookUpdateJob = new cron.CronJob('*/30 * * * * *', async () => {
  console.log("Updating order books...");
  //todo:
  const coinsData: CoinsData = await coinService.getCoinsData() as unknown as CoinsData
  for (const coinSlug in coinsData) {
    const markets = coinsData[coinSlug];
    for (const market of markets) {
      const updatedData = await mainService.updateOrderBook(coinSlug, market.marketPair, market.exchangeName);
      console.log(`Updated order book for ${coinSlug} on ${market.exchangeName}:`, updatedData);
    }
  }
});

export function startCronJobs() {
  dailyUpdateJob.start();
  orderBookUpdateJob.start();
}
