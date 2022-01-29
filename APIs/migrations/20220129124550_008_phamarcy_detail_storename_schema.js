/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function (knex) {
    await knex.raw(`
        ALTER TABLE phamarcyDetail
        RENAME COLUMN name 
        TO "storeName";`);
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.raw(`
        ALTER TABLE phamarcyDetail
        RENAME COLUMN "storeName" 
        TO name`);
  };