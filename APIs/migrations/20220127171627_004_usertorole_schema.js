/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TABLE userToRole (
          "roleID" INT REFERENCES roles("roleID") NOT NULL,
          "userID" INT REFERENCES userDetail("userID") NOT NULL,
          PRIMARY KEY ("userID","roleID")
      )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE userToRole`);
};
