import {fetchOrderBook} from "../utils/ccxt.js";

export class MainService {

  async updateOrderBook(coinSlug: string, marketPair: string, exchangeSlug: string) {
    return await fetchOrderBook(exchangeSlug, marketPair);
  }
}

export const mainService = new MainService()