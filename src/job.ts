import * as cron from "cron";
import {CoinsData, PricesList} from "./types";
import {mainService} from "./services/main.service";
import {coinService} from "./services/coin.service";
import {LogDescription} from "ccxt/js/src/static_dependencies/ethers";

const dailyUpdateJob = new cron.CronJob('0 0 * * *', async () => {
  console.log("Running daily update...");
  const data = await mainService.initializeCoinsData();
  console.log(data);
});

const orderBookUpdateJob = new cron.CronJob('*/30 * * * * *', async () => {
    console.log("Updating order books...");

    const coinsData: CoinsData = await coinService.getCoinsData()

    const pricesList: PricesList = {};
    const orderBookPromises = Object.entries(coinsData).slice(0,1).map(async (entry) => {
      //todo: separate function
      const [slug, markets] = entry

      if (!markets.length) {
        return null
      }
      const pricesPromises = markets.map(async market => {
        const updated = await mainService.updateOrderBook(slug, market.marketPair, market.exchangeName)

        if (!pricesList[slug]) {
          pricesList[slug] = {};
        }
        if (!pricesList[slug][market.exchangeName]) {
          pricesList[slug][market.exchangeName] = {};
        }

        pricesList[slug][market.exchangeName] = {
          time: new Date(),
          buy: updated.buy,
          sell: updated.sell
        };

        return updated
      })

      const prices = await Promise.all(pricesPromises)
      try {
        const resultData = mainService.getExtremePrices(slug, prices)
        console.log(`
          ${slug.toUpperCase()}
          ${new Date().toUTCString()}
         
          ${resultData.percentageDifference}%
          
          buy
          price: ${resultData.bestBuy.buy}
          (${resultData.bestBuy.buy}) <=> (${resultData.bestSell.sell})
          volume: ${resultData.bestBuy.buyVolume}
          
          sell
          price: ${resultData.bestSell.sell}
          (${resultData.bestBuy.buy}) <=> (${resultData.bestSell.sell})
          volume: ${resultData.bestSell.sell}`)
      } catch (e) {
        console.log('No prices for', slug)
        return null
      }
    })
    await Promise.all(orderBookPromises)
  })
;

export function startCronJobs() {
  mainService.initializeCoinsData();
  console.log('Coin Data Initialized')
  dailyUpdateJob.start();
  orderBookUpdateJob.start();
}
