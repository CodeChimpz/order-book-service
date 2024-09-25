import * as cron from "cron";
import express, {json} from 'express';
import {mainJob} from "./job.js";

const orderBookUpdateJob = new cron.CronJob('*/30 * * * * *', mainJob.job.bind(mainJob));
orderBookUpdateJob.start();

const app = express();
app.use(json());
app.get('', (req, res) => res.status(200).json(mainJob.result))
const port = process.env.PORT;
// Start the server
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
});
