/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TABLE consultantDetailMedia (
        "userID" INT REFERENCES userDetail("userID") NOT NULL,
        "consultantDetailMediaID" serial not null primary key,
        "imageBase64" BYTEA
        )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE consultantDetailMedia`);
};
