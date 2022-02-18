/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(
    `CREATE TYPE paymentStatus AS ENUM ('created', 'paid', 'cancle')`
  );
  await knex.raw(`CREATE TABLE payment (
          "paymentID"  serial not null primary key,
          "channel" VARCHAR(30),
          "price" NUMERIC,
          "ref1" VARCHAR(12),
          "ref2" VARCHAR(12),
          "createDate" TIMESTAMP,
          "confirmDate" TIMESTAMP, 
          "expireDate"  TIMESTAMP,
          "paymentStatus" paymentStatus NOT NULL DEFAULT 'created'
      )`);
  await knex.raw(
    `CREATE TYPE communicationChannel AS ENUM ('message', 'voice', 'video')`
  );
  await knex.raw(
    `CREATE TYPE jobStatus AS ENUM ('created', 'paid', 'meeting', 'hanged up', 'finished', 'reported', 'cancle')`
  );
  await knex.raw(`CREATE TABLE consultJob (
        "jobID"  serial not null primary key,
        "schduleDate" TIMESTAMP,
        "reservePeriod_m" INT,
        "symptomDetail" VARCHAR(255),
        "communicationChannel" communicationChannel NOT NULL DEFAULT 'video',
        "meetStartDate" TIMESTAMP,
        "meetEndDate" TIMESTAMP, 
        "advice"  VARCHAR(255),
        "jobStatus" jobStatus NOT NULL DEFAULT 'created',
        "consultantID" INT REFERENCES userDetail("userID") NOT NULL,
        "customerID" INT REFERENCES userDetail("userID") NOT NULL,
        "paymentID" INT REFERENCES payment("paymentID")
    )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE consultJob`);
  await knex.raw(`DROP TYPE jobStatus`);
  await knex.raw(`DROP TYPE communicationChannel`);
  await knex.raw(`DROP TABLE payment`);
  await knex.raw(`DROP TYPE paymentStatus`);
};
