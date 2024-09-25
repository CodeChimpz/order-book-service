import {coinService} from "../coin/coin.service.js";
import {Request, Response} from "express";

export class AppController {
  constructor() {
  }

  getAllCoins = async (req: Request, res: Response) => {
    console.log('Fetching coin data from db')
    const result = await coinService.getCoinsData()
    return res.status(200).json(result)
  }
}

export const controller = new AppController()