// src/utils/bigDecimalUtils.ts
import bigDecimal from "js-big-decimal";
import { config } from "../config/index";

export function collectVolume(arr: number[][]) {
  const amountInUsdt = new bigDecimal(config.minVolume.toString());
  const res = {
    price: new bigDecimal("0"),
    volume: new bigDecimal("0"),
    amount: new bigDecimal("0"),
    depth: 0
  };

  while (res.amount.compareTo(amountInUsdt) === -1 && arr[res.depth]) {
    const [price, volume] = arr[res.depth];
    const priceBd = new bigDecimal(price.toString());
    const volumeBd = new bigDecimal(volume.toString());

    res.volume = res.volume.add(volumeBd);
    res.amount = volumeBd.multiply(priceBd).add(res.amount);
    res.price = res.amount.divide(res.volume);
    res.depth++;
  }

  return res;
}
