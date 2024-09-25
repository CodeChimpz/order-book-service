import {CoinsData} from "./types/index.js";
import {fetchInitCoinData} from "./utils/init.service.js";
import {mainService} from "./services/main.service.js";

export class MainJob {
  constructor() {
  }

  result: { [key: string]: any } = {}

  async job() {
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
    for (const coin of coinsDataFiltered) {
      const {slug: coinSlug, data: markets} = coin;
      for (const market of markets) {
        const updatedData = await mainService.updateOrderBook(coinSlug, market.marketPair, market.exchangeName);
        if (!this.result[coinSlug]) {
          this.result = {[coinSlug]: {[market.exchangeName]: updatedData}}
        } else {
          this.result[coinSlug][market.exchangeName] = updatedData
        }
        // console.log(this.result)
      }
    }
    console.log('Updated result')
  }
}

export const mainJob = new MainJob()