import {CoinsData} from "../types";
import got from "got";
import {config} from "dotenv";

config()

export async function fetchInitCoinData(): Promise<CoinsData> {
  //todo: auth
  const result = await got(process.env.INITSERVICE_URL + '/all')
  return JSON.parse(result.body)
}