/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
    INSERT INTO roles ("roleName")
    VALUES ('admin'),
        ('customer'),
        ('consultant'),
        ('phamarcy')`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
    DELETE FROM roles
    WHERE "roleName" = 'admin' 
    OR "roleName" = 'customer' 
    OR "roleName" = 'consultant' 
    OR "roleName" = 'phamarcy'`);
};
