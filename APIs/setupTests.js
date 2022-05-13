import "regenerator-runtime/runtime";
import { pool } from "./app/config/db.config";
import meetScheduleCron from "./app/cron/cron-jobs";
import { server } from "./server";
beforeAll(() => console.log("beforeAll"));
afterAll((done) => {
  meetScheduleCron.stop();
  server.close(done);
  pool.end();
  console.log("afterAll");
});
