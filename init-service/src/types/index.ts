export interface Market {
  marketPair: string;
  exchangeName: string;
}

export interface CoinsData {
  [coinSlug: string]: Market[];
}

export interface OrderBookLocal {
  buy: number;
  sell: number;
  buyVolume: number;
  sellVolume: number;
  // buyUrl: string;
  // sellUrl: string;
  time: Date;
}

export interface PricesList {
  [slug: string]: {
    [exchangeName: string]: OrderBookLocal | {};
  };
}

export type BestPricesResult = {
  bestBuy: OrderBookLocal, bestSell: OrderBookLocal, percentageDifference: number
}





