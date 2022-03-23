const { pool } = require("../config/db.config");

exports.getStoreDetail = async (req, res) => {
  const { userID } = req;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let {
      rows: [store],
    } = await client.query(
      ` SELECT *
          FROM phamarcyDetail
          WHERE "userID" = $1 ;`,
      [userID]
    );

    if (!store) {
      await client.query("ROLLBACK");
      return res.status(400).send({ message: "Store not found" });
    }

    await client.query("COMMIT");

    return res.status(200).send(store);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
