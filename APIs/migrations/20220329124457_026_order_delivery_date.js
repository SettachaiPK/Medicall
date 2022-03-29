/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
          ALTER TABLE productOrder
          ADD COLUMN "deliveryDate" TIMESTAMP,
          ADD COLUMN "receiveDate" TIMESTAMP;`);
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.raw(`
          ALTER TABLE productOrder 
          DROP COLUMN "deliveryDate",
          DROP COLUMN "receiveDate";`);
  };