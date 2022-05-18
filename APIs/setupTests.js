import "regenerator-runtime/runtime";
import { pool } from "./app/config/db.config";
import meetScheduleCron from "./app/cron/cron-jobs";
import { server } from "./server";
beforeAll(async () => {
  let pass = false;
  console.log("beforeAll...");
  // while (!pass) {
  //   pool.query("SELECT NOW()", (err, res) => {
  //     console.log(".");
  //     if (res) {
  //       console.log("beforeAll connected to postgresql database");
  //       pass = true;
  //     } else {
  //       console.log("beforeAll Can not connect to postgresql database ", err);
  //     }
  //   });
  // }
});
afterAll((done) => {
  meetScheduleCron.stop();
  server.close(done);
  pool.end();
  console.log("afterAll");
});
