/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`DROP TABLE phamarcyDetail`);
    await knex.raw(`CREATE TABLE phamarcyDetail (
        "storeID" serial not null primary key,
        "ownerID" INT REFERENCES userDetail("userID") NOT NULL,
        "storeName" VARCHAR(50),
        "location" VARCHAR(255),
        "avatar" VARCHAR(2083),
        "licenseNumber" VARCHAR(50),
        "personalID" VARCHAR(50),
        "registerDate" TIMESTAMP,
        "status" roleStatus NOT NULL DEFAULT 'waiting approval'
    )`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.raw(`DROP TABLE phamarcyDetail`);
    await knex.raw(`CREATE TABLE phamarcyDetail (
        "userID" INT REFERENCES userDetail("userID") NOT NULL,
        PRIMARY KEY ("userID"),
        "storeName" VARCHAR(50),
        "location" VARCHAR(255),
        "avatar" VARCHAR(2083),
        "licenseNumber" VARCHAR(50),
        "personalID" VARCHAR(50),
        "registerDate" TIMESTAMP,
        "status" roleStatus NOT NULL DEFAULT 'waiting approval'
    )`);
};
