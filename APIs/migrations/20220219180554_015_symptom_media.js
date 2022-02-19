/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TABLE symptomMedia (
    "jobID"  INT REFERENCES consultJob("jobID"),
    "symptomMediaID"  serial not null primary key,
    "imageBase64" TEXT
)`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE symptomMedia`);
};
