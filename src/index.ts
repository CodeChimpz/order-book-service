import { startCronJobs } from "./cron";

(async function main() {
  console.log("Starting...");

  startCronJobs();
})();
