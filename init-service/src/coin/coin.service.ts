import {CoinsData} from '../types/index.js';
import {Coin, ICoin} from "./coin.schema.js";

export class CoinService {
  constructor() {
  }

  async saveCoinsData(coinsData: CoinsData): Promise<void> {
    try {
      const queryPromise = Object.entries(coinsData).map(row => {
        const [slug, markets] = row
        return Coin.findOneAndUpdate(
          {slug},
          {slug, markets},
          {upsert: true, new: true}
        );
      })
      await Promise.all(queryPromise)
      console.log('Coins data saved to MongoDB');
    } catch (error) {
      console.error('Error saving coins data to MongoDB:', error);
      throw error;
    }
  }

  async getCoinsData(): Promise<CoinsData> {
    const result = await Coin.find({});
    return this.convertCoinsToData(result)
  }

  convertCoinsToData = (coins: ICoin[]): CoinsData => {
    return coins.reduce<CoinsData>((acc, coin) => {
      acc[coin.slug] = coin.markets;
      return acc;
    }, {});
  };
}

export const coinService = new CoinService()

