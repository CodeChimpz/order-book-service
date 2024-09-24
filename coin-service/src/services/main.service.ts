import {fetchOrderBook} from "../utils/ccxt";
import {OrderBookLocal} from "../types";

export class MainService {
  data: any[] = []

  async updateOrderBook(coinSlug: string, marketPair: string, exchangeSlug: string) {
    const orderBook = await fetchOrderBook(exchangeSlug, marketPair);
    this.data.push(orderBook)
  }
}

export const mainService = new MainService()