import {CoinsData} from "./types/index.js";
import {fetchInitCoinData} from "./utils/init.service.js";
import {mainService} from "./services/main.service.js";

export const result: { [key: string]: any } = {}

export async function MainJob() {
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
      result[coinSlug] = updatedData
    }
  }
  console.log('Updated result')
}