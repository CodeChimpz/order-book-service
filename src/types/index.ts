export interface Market {
  marketPair: string;
  exchangeName: string;
}

export interface CoinsData {
  [coinSlug: string]: Market[];
}

export interface OrderBookLocal {
  buy: string;
  sell: string;
  time: Date;
}




