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

exports.addProduct = async (req, res) => {
  const {
    userID,
    body: { productName, productDetail, productPrice },
    files,
  } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let {
      rows: [store],
    } = await client.query(
      ` SELECT *
          FROM phamarcyDetail
          WHERE "ownerID" = $1 ;`,
      [userID]
    );

    let {
      rows: [{ productID }],
    } = await client.query(
      ` INSERT INTO product ("storeID","productName","productDetail","productPrice")
          VALUES ($1, $2, $3, $4)
        RETURNING "productID"`,
      [store.storeID, productName, productDetail, productPrice]
    );

    if (files) {
      const { media } = await files;
      if (media.length) {
        for (let index = 0; index < media.length; index++) {
          const image = await media[index];
          if (!image.name.match(/\.(jpg|jpeg|png)$/i)) {
            await client.query("ROLLBACK");
            return res.status(415).send({ message: "wrong file type" });
          }
          if (image.truncated) {
            await client.query("ROLLBACK");
            return res.status(413).send({ message: "file too large" });
          }
          await client.query(
            `
          INSERT INTO productMedia ("productID", "imageBase64")
          VALUES ($1, $2)`,
            [productID, image.data.toString("base64")]
          );
        }
      } else {
        if (!media.name.match(/\.(jpg|jpeg|png)$/i)) {
          await client.query("ROLLBACK");
          return res.status(415).send({ message: "wrong file type" });
        }
        if (media.truncated) {
          await client.query("ROLLBACK");
          return res.status(413).send({ message: "file too large" });
        }
        await client.query(
          `
          INSERT INTO productMedia ("productID", "imageBase64")
          VALUES ($1, $2)`,
          [productID, media.data.toString("base64")]
        );
      }
    }

    await client.query("COMMIT");

    return res.status(200).send({
      message: "Product added",
      productID,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.editProduct = async (req, res) => {
  const {
    userID,
    body: { productID, productName, productDetail, productPrice },
    files,
  } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { rows: ownerIDs } = await client.query(
      ` SELECT "ownerID" 
        FROM phamarcyDetail
        INNER JOIN product
        ON phamarcyDetail."storeID" = product."storeID"
        WHERE "productID" = ($1)`,
      [productID]
    );
    if (ownerIDs.length === 0) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission denied" });
    }
    if (ownerIDs[0].ownerID !== userID) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission denied" });
    }
    await client.query(
      ` UPDATE product 
        SET ("productName","productDetail","productPrice") = ($2,$3,$4)
        WHERE "productID" = ($1)`,
      [productID, productName, productDetail, productPrice]
    );
    await client.query(
      ` DELETE FROM productMedia
        WHERE "productID" = ($1);`,
      [productID]
    );
    if (files) {
      const { media } = await files;
      if (media.length) {
        for (let index = 0; index < media.length; index++) {
          const image = await media[index];
          if (!image.name.match(/\.(jpg|jpeg|png)$/i)) {
            await client.query("ROLLBACK");
            return res.status(415).send({ message: "wrong file type" });
          }
          if (image.truncated) {
            await client.query("ROLLBACK");
            return res.status(413).send({ message: "file too large" });
          }
          await client.query(
            `
          INSERT INTO productMedia ("productID", "imageBase64")
          VALUES ($1, $2)`,
            [productID, image.data.toString("base64")]
          );
        }
      } else {
        if (!media.name.match(/\.(jpg|jpeg|png)$/i)) {
          await client.query("ROLLBACK");
          return res.status(415).send({ message: "wrong file type" });
        }
        if (media.truncated) {
          await client.query("ROLLBACK");
          return res.status(413).send({ message: "file too large" });
        }
        await client.query(
          `
          INSERT INTO productMedia ("productID", "imageBase64")
          VALUES ($1, $2)`,
          [productID, media.data.toString("base64")]
        );
      }
    }

    await client.query("COMMIT");

    return res.status(200).send({
      message: "Product edited",
      productID,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
