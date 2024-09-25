import * as cron from "cron";
import express, {json} from 'express';
import {MainJob, result} from "./job.js";

const orderBookUpdateJob = new cron.CronJob('*/30 * * * * *', MainJob);
orderBookUpdateJob.start();

const app = express();
app.use(json());
app.get('', (req, res) => res.status(200).json(result))
const port = process.env.PORT;
// Start the server
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
});
