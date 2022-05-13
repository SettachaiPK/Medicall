const cron_config = require("../config/cron.config");
const { pool } = require("../config/db.config");
const { JOB_SCHEDULE } = cron_config;
const cron = require("node-cron");
const moment = require("moment");
const { consultingEstablishment } = require("../controllers/socket.controller");

const meetScheduleCron = cron.schedule(
  JOB_SCHEDULE,
  async () => {
    const client = await pool.connect();
    try {
      const now = moment();
      now.set({ second: 0, millisecond: 0 });
      console.log(now);
      const { rows: jobDetails } = await client.query(
        `SELECT *
        FROM consultJob
        INNER JOIN schedule AS "schedule" USING ("scheduleID")
        WHERE "scheduleStatus" = 'booked'
        AND "startDate" = $1`,
        [now.format()]
      );
      console.log(jobDetails);
      jobDetails.forEach((jobDetail) => {
        consultingEstablishment(jobDetail);
      });
    } catch (err) {
      console.log(err);
    } finally {
      client.release();
    }
  },
  {
    scheduled: true,
  }
);
meetScheduleCron.start();
module.exports = meetScheduleCron;
