import {fetchOrderBook} from "../utils/ccxt.js";

export class MainService {
  data: any[] = []

  async updateOrderBook(coinSlug: string, marketPair: string, exchangeSlug: string) {
    const orderBook = await fetchOrderBook(exchangeSlug, marketPair);
    this.data.push(orderBook)
  }
}

export const mainService = new MainService()