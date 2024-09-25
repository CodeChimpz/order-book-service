import * as cron from "cron";
import {CoinsData} from "./types";
import {mainService} from "./services/main.service";
import {fetchInitCoinData} from "./utils/init.service";

const orderBookUpdateJob = new cron.CronJob('*/30 * * * * *', async () => {
  console.log("Updating order books...");
  const coinsListSet = `${process.env.COINS}`.split(',')
  const coinsData: CoinsData = await fetchInitCoinData()
  const coinsDataFiltered = Object.entries(coinsData).map(entry => ({
    slug: entry[0],
    data: entry[1]
  })).filter(row =>
    coinsListSet.includes(row.slug)
  )
  console.log('Querying for :', coinsListSet)
  console.log(Object.entries(coinsData).length, ' > ', coinsDataFiltered.length)
  for (const coin of coinsDataFiltered) {
    const {slug: coinSlug, data: markets} = coin;
    for (const market of markets) {
      const updatedData = await mainService.updateOrderBook(coinSlug, market.marketPair, market.exchangeName);
      console.log(`Updated order book for ${coinSlug} on ${market.exchangeName}:`, updatedData);
    }
  }
});

orderBookUpdateJob.start();