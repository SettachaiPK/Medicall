/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function (knex) {
    await knex.raw(
      `CREATE TYPE onlineStatus AS ENUM ('online', 'busy', 'offline')`
    );
    await knex.raw(`CREATE TABLE consultantService (
            "userID" INT REFERENCES userDetail("userID") NOT NULL,
            PRIMARY KEY ("userID"),
            "detail" VARCHAR(255),
            "messagePrice" INT,
            "voiceCallPrice" INT,
            "videoCallPrice" INT,
            "onlineStatus" onlineStatus NOT NULL DEFAULT 'online'
        )`);
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.raw(`DROP TABLE consultantService`);
    await knex.raw(`DROP TYPE onlineStatus`);
  };
  