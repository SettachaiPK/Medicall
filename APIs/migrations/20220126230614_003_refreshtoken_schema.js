/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function (knex) {
    await knex.raw(`CREATE TABLE RefreshToken (
        userID INT REFERENCES userDetail(userID) NOT NULL,
        refreshToken VARCHAR(255),
        PRIMARY KEY (userID)
    )`);
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.raw(`DROP TABLE RefreshToken`);
  };