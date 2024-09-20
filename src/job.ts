import * as cron from "cron";
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
  const coinsData: CoinsData = await coinService.getCoinsData()
  const orderBookPromises = Object.entries(coinsData).map(async (entry) => {
    const [slug, markets] = entry
    if (!markets.length) {
      return null
    }
    for (const market of markets) {
      const updatedData = await mainService.updateOrderBook(slug, market.marketPair, market.exchangeName);
      console.log(`Updated order book for ${slug} on ${market.exchangeName}:`, updatedData);
    }
  })
  await Promise.all(orderBookPromises)
});

export function startCronJobs() {
  mainService.initializeCoinsData();
  console.log('Coin Data Initialized')
  dailyUpdateJob.start();
  orderBookUpdateJob.start();
}
