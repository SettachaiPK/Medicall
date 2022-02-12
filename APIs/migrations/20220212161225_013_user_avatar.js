/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
    ALTER TABLE consultantService 
    DROP COLUMN "consultantAvatar";`);
  await knex.raw(`
    ALTER TABLE userDetail 
    ADD COLUMN "avatar"  TEXT;`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
      ALTER TABLE consultantService 
      ADD COLUMN "consultantAvatar" BYTEA;`);
  await knex.raw(`
      ALTER TABLE userDetail 
      DROP COLUMN "avatar";`);
};
