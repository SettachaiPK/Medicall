/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(
    `CREATE TYPE orderStatus AS ENUM ('pending', 'paid', 'shipped', 'received', 'cancelled')`
  );
  await knex.raw(`CREATE TABLE productOrder (
            "orderID" serial not null primary key,
            "orderDescription" VARCHAR(255),
            "deliveryLocation" VARCHAR(255),
            "deliveryChannel" VARCHAR(50),
            "totalPrice" NUMERIC,
            "deliveryNumber" VARCHAR(50),
            "createDate" TIMESTAMP,
            "orderStatus" orderStatus NOT NULL DEFAULT 'pending',
            "customerID" INT REFERENCES userDetail("userID") NOT NULL,
            "storeID" INT REFERENCES phamarcydetail("storeID") NOT NULL    
        )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE productOrder`);
  await knex.raw(`DROP TYPE orderStatus`);
};
