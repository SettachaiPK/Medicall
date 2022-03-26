/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TABLE productOrderToProduct (
              "orderID" INT REFERENCES productOrder("orderID") NOT NULL,
              "productID" INT REFERENCES product("productID") NOT NULL,
              "pricePerPiece" NUMERIC,
              "amount" INT
          )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE productOrderToProduct`);
};
