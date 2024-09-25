import mongoose, {Schema, Document} from 'mongoose';
import {Market} from "../types/index.js";

//todo: schema validation
const CoinSchema: Schema = new Schema({
  slug: {type: String, required: true, unique: true},
  markets: [
    {
      marketPair: {type: String, required: true},
      exchangeName: {type: String, required: true},
      volumeUsd: {type: Number, required: true},
      quoteSymbol: {type: String, required: true},
    },
  ],
});

export interface ICoin extends Document {
  slug: string;
  markets: Market[];
}

export const Coin = mongoose.model<ICoin>('Coin', CoinSchema);
