/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(
    `CREATE TYPE OTPStatus AS ENUM ('waiting', 'success', 'expired', 'cancel')`
  );
  await knex.raw(`CREATE TABLE OTP (
        otpID serial not null primary key,
        password VARCHAR(60),
        ref VARCHAR(30),
        expiredDate TIMESTAMP,
        status OTPStatus NOT NULL DEFAULT 'waiting',
        createDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        phoneNumber VARCHAR(10))`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE OTP`);
  await knex.raw(`DROP TYPE OTPStatus`);
};
