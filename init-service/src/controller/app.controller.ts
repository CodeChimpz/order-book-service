import {coinService} from "../coin/coin.service.js";

export class AppController {
  constructor() {
  }

  getAllCoins = async () => {
    return coinService.getCoinsData()
  }
}
export const controller = new AppController()