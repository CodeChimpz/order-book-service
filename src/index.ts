import { startCronJobs } from "./job";
import {connect} from "./db/connections";

(async function main() {
  console.log("Starting...");
  await connect()
  startCronJobs();
})();
