/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TABLE product (
        "productID" serial not null primary key,
        "storeID" INT REFERENCES phamarcyDetail("storeID") NOT NULL,
        "productName" VARCHAR(50),
        "productDetail" VARCHAR(255),
        "productPrice" NUMERIC
    )`);
  await knex.raw(`CREATE TABLE productMedia (
        "productID" INT REFERENCES product("productID") NOT NULL,
        "productMediaID" serial not null primary key,
        "imageBase64" TEXT
        )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE productMedia`);
  await knex.raw(`DROP TABLE product`);
};
