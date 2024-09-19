import {CoinsData} from '../types';
import {Coin, ICoin} from "../db/schema/coin.schema";

export class CoinService {
  constructor() {
  }

  async saveCoinsData(coinsData: CoinsData): Promise<void> {
    try {
      for (const slug in coinsData) {
        const markets = coinsData[slug];

        // Find or create a coin entry in MongoDB
        await Coin.findOneAndUpdate(
          {slug},
          {slug, markets},
          {upsert: true, new: true}
        );
      }
      console.log('Coins data saved to MongoDB');
    } catch (error) {
      console.error('Error saving coins data to MongoDB:', error);
      throw error;
    }
  }

  async getCoinsData(): Promise<ICoin[]> {
    return Coin.find({});
  }
}

export const coinService = new CoinService()

