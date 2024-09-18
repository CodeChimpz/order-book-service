// src/index.ts
import { startCronJobs } from "./cron";

(async function main() {
  console.log("Starting Crypto Monitoring System...");

  // Start CRON jobs
  startCronJobs();
})();
