import ccxt from "ccxt";

export async function getExchangeInstance(exchangeSlug: string) {
  if (exchangeSlug in ccxt.pro) {
    const Exchange = ccxt.pro[exchangeSlug as keyof typeof ccxt.pro];
    return new Exchange();
  } else {
    throw new Error(`Exchange ${exchangeSlug} is not supported by ccxt.pro`);
  }
}

export async function fetchOrderBook(exchangeSlug: string, marketPair: string) {
  const exchange = await getExchangeInstance(exchangeSlug);
  return await exchange.fetchOrderBook(marketPair);
}