import * as cron from "cron";
import express, {json} from 'express';
import {controller} from "./controller/app.controller";
import {MainJob} from "./job";

const dailyUpdateJob = new cron.CronJob('0 0 * * *', MainJob);
dailyUpdateJob.start();

//Server
const app = express();
app.use(json());
app.get('/all', controller.getAllCoins.bind(controller))
const port = process.env.PORT;
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});