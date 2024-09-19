export interface Market {
  marketPair: string;
  exchangeName: string;
}

export interface CoinsData {
  [coinSlug: string]: Market[];
}

// OrderBook interface representing buy and sell volumes and timestamps
export interface OrderBookLocal {
  buy: string;
  sell: string;
  time: Date;
}




