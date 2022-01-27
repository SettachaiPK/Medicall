/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TABLE roles (
        "roleID" serial not null primary key,
        "roleName" VARCHAR(20)
    )`);
  await knex.raw(
    `CREATE TYPE roleStatus AS ENUM ('waiting approval', 'active', 'inactive')`
  );
  await knex.raw(`CREATE TABLE customerDetail (
        "userID" INT REFERENCES userDetail("userID") NOT NULL,
        PRIMARY KEY ("userID"),
        "height" INT,
        "weight" INT,
        "congenitalDisease" VARCHAR(255),
        "drugAllergy" VARCHAR(255),
        "drugInUse" VARCHAR(255),
        "registerDate" TIMESTAMP,
        "status" roleStatus NOT NULL DEFAULT 'active'
    )`);
  await knex.raw(`CREATE TABLE consultantDetail (
          "userID" INT REFERENCES userDetail("userID") NOT NULL,
          PRIMARY KEY ("userID"),
          "ocupation" VARCHAR(255),
          "department" VARCHAR(255),
          "infirmary" VARCHAR(255),
          "academy" VARCHAR(255),
          "licenseNumber" VARCHAR(255),
          "personalID" VARCHAR(50),
          "registerDate" TIMESTAMP,
          "status" roleStatus NOT NULL DEFAULT 'waiting approval'
      )`);
  await knex.raw(`CREATE TABLE phamarcyDetail (
              "userID" INT REFERENCES userDetail("userID") NOT NULL,
              PRIMARY KEY ("userID"),
              "name" VARCHAR(50),
              "location" VARCHAR(255),
              "avatar" VARCHAR(2083),
              "licenseNumber" VARCHAR(50),
              "personalID" VARCHAR(50),
              "registerDate" TIMESTAMP,
              "status" roleStatus NOT NULL DEFAULT 'waiting approval'
          )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE roles`);
  await knex.raw(`DROP TABLE customerDetail`);
  await knex.raw(`DROP TABLE consultantDetail`);
  await knex.raw(`DROP TABLE phamarcyDetail`);
  await knex.raw(`DROP TYPE roleStatus`);
};
