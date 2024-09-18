// src/cron.ts
import { initializeCoinsData, updateOrderBook } from "./services/cryptoService";
import cron from "cron";

const dailyUpdateJob = new cron.CronJob('0 0 * * *', async () => {
  console.log("Running daily update...");
  const data = await initializeCoinsData();
  console.log(data);
});

const orderBookUpdateJob = new cron.CronJob('*/30 * * * * *', async () => {
  console.log("Updating order books...");
  const coinsData = await initializeCoinsData();
  for (const coinSlug in coinsData) {
    const markets = coinsData[coinSlug];
    for (const market of markets) {
      const updatedData = await updateOrderBook(coinSlug, market.marketPair, market.exchangeName);
      console.log(`Updated order book for ${coinSlug} on ${market.exchangeName}:`, updatedData);
    }
  }
});

export function startCronJobs() {
  dailyUpdateJob.start();
  orderBookUpdateJob.start();
}
