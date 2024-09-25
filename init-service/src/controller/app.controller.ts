import {coinService} from "../coin/coin.service";

export class AppController {
  constructor() {
  }

  getAllCoins = async () => {
    return coinService.getCoinsData()
  }
}
export const controller = new AppController()