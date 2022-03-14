/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
        CREATE TABLE jobReview (
        "jobReviewID" serial not null primary key,
        "jobID"  INT REFERENCES consultJob("jobID"),
        "rating" INT,
        "reason" VARCHAR(255),
        "createDate" TIMESTAMP
    )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE jobReview`);
};
