/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TABLE consultJobRecommendedProduct (
          "productID" INT REFERENCES product("productID") NOT NULL,
          "jobID" INT REFERENCES consultJob("jobID") NOT NULL,
          PRIMARY KEY ("jobID","productID")
      )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE consultJobRecommendedProduct`);
};
