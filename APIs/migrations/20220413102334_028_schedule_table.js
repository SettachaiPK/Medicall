/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TYPE scheduleStatus AS ENUM ('bookable', 'booked')`);
  await knex.raw(`CREATE TABLE schedule (
                "scheduleID" serial not null primary key,
                "startDate" TIMESTAMP,
                "endDate" TIMESTAMP,
                "scheduleStatus" scheduleStatus NOT NULL DEFAULT 'bookable',
                "consultantID" INT REFERENCES consultantService("userID") NOT NULL
            )`);
  await knex.raw(`
                    ALTER TABLE consultjob
                    ADD COLUMN "scheduleID" INT REFERENCES schedule("scheduleID");`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
  ALTER TABLE consultjob 
  DROP COLUMN "scheduleID";`);
  await knex.raw(`DROP TABLE schedule`);
  await knex.raw(`DROP TYPE scheduleStatus`);
};
