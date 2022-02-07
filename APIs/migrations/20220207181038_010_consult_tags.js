/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TABLE consultTags (
            "tagID"  serial not null primary key,
            "tagName" VARCHAR(50)
        )`);
  await knex.raw(`CREATE TABLE serviceToConsultTags (
            "tagID"   INT REFERENCES consultTags("tagID") NOT NULL,
            "userID" INT REFERENCES userDetail("userID") NOT NULL,
            PRIMARY KEY ("userID","tagID")
        )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE serviceToConsultTags`);
  await knex.raw(`DROP TABLE consultTags`);
};
