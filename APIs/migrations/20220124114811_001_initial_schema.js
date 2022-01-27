/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TYPE sex AS ENUM ('female', 'male')`);
  await knex.raw(`CREATE TYPE userStatus AS ENUM ('unsigned', 'active', 'inactive')`);
  await knex.raw(`CREATE TABLE userDetail (
        "userID" serial not null primary key,
        "phoneNumber" VARCHAR(10),
        "firstName" VARCHAR(30),
        "lastName" VARCHAR(30),
        "sex" Sex,
        "birthDate" TIMESTAMP,
        "registeredDate" TIMESTAMP,
        "status" userStatus NOT NULL DEFAULT 'unsigned')`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE userDetail`);
  await knex.raw(`DROP TYPE sex`);
  await knex.raw(`DROP TYPE userStatus`);
};
