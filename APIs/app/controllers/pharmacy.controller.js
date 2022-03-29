const { pool } = require("../config/db.config");
const moment = require("moment");

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
        console.log("files");
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
        console.log("file");
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
        WHERE "productID" = ($1)
        AND "isActive" = TRUE`,
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

exports.deleteProduct = async (req, res) => {
  const {
    userID,
    params: { productID },
  } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { rows: ownerIDs } = await client.query(
      ` SELECT "ownerID" 
        FROM phamarcyDetail
        INNER JOIN product
        USING("storeID")
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
        SET "isActive" = FALSE
        WHERE "productID" = ($1)`,
      [productID]
    );

    await client.query("COMMIT");

    return res.status(200).send({
      message: "Product deleted",
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

exports.getProducts = async (req, res) => {
  const { userID } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const {
      rows: [{ storeID }],
    } = await client.query(
      ` SELECT "storeID"
        FROM phamarcyDetail
        WHERE "ownerID" = ($1)`,
      [userID]
    );
    if (!storeID) {
      await client.query("ROLLBACK");
      res.status(403).send({ message: "Permission Denied" });
    }
    const { rows: products } = await client.query(
      ` SELECT * 
        FROM product   
        LEFT JOIN (
          SELECT DISTINCT ON ("productID")
            "productID", "imageBase64" AS "productMedia"
          FROM   productMedia
          )  AS "productMedia" USING ("productID")
        WHERE "storeID" = ($1)
        AND "isActive" = TRUE`,
      [storeID]
    );

    await client.query("COMMIT");

    return res.status(200).send(products);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getProductDetail = async (req, res) => {
  const { userID } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const {
      rows: [{ storeID }],
    } = await client.query(
      ` SELECT "storeID"
        FROM phamarcyDetail
        WHERE "ownerID" = ($1)`,
      [userID]
    );
    if (!storeID) {
      await client.query("ROLLBACK");
      res.status(403).send({ message: "Permission Denied" });
    }
    const { rows: products } = await client.query(
      ` SELECT * 
        FROM product   
        LEFT JOIN (
          SELECT "productID", array_agg("imageBase64") AS "productMedia"
          FROM   productMedia
          GROUP BY "productID"
          ) AS "productMedia" USING ("productID")
        WHERE "storeID" = ($1)`,
      [storeID]
    );

    await client.query("COMMIT");

    return res.status(200).send(products);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getOrders = async (req, res) => {
  const { userID } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: productorder } = await client.query(
      ` SELECT *
        FROM productorder
        INNER JOIN 
          (SELECT "storeID","ownerID" FROM phamarcyDetail) 
        AS phamarcyDetail USING ("storeID")
        LEFT JOIN (
          SELECT "orderID", array_agg(json_build_object(
            'productID', "productID", 
            'pricePerPiece', "pricePerPiece", 
            'amount', "amount", 
            'productName', "productName"
          )) AS "products"
          FROM   productordertoproduct
          INNER JOIN product
          AS product USING("productID")
          WHERE "isActive" = TRUE
          GROUP BY "orderID"
          ) AS "productordertoproduct" USING ("orderID")
        WHERE "ownerID" = ($1);`,
      [userID]
    );
    if (!productorder) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission Denied" });
    }

    await client.query("COMMIT");

    return res.status(200).send(productorder);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getOrderDetail = async (req, res) => {
  const {
    userID,
    params: { orderID },
  } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      rows: [productorder],
    } = await client.query(
      ` SELECT *
        FROM productorder
        INNER JOIN 
          (SELECT "storeID","ownerID" FROM phamarcyDetail) 
        AS phamarcyDetail USING ("storeID")
        LEFT JOIN (
          SELECT "orderID", array_agg(json_build_object(
            'productID', "productID", 
            'pricePerPiece', "pricePerPiece", 
            'amount', "amount", 
            'productName', "productName"
          )) AS "products"
          FROM   productordertoproduct
          INNER JOIN product
          AS product USING("productID")
          WHERE "isActive" = TRUE
          GROUP BY "orderID"
          ) AS "productordertoproduct" USING ("orderID")
        WHERE "ownerID" = ($1)
        AND "orderID" = $2;`,
      [userID, orderID]
    );
    if (!productorder) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission Denied" });
    }

    await client.query("COMMIT");

    return res.status(200).send(productorder);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.confirmSendOrder = async (req, res) => {
  const {
    userID,
    body: { orderID, deliveryNumber },
  } = req;
  const client = await pool.connect();
  const now = moment()

  try {
    await client.query("BEGIN");

    const {
      rows: [productorder],
    } = await client.query(
      ` SELECT "orderStatus"
        FROM productorder
        INNER JOIN phamarcydetail
        USING ("storeID")
        WHERE "ownerID" = ($1)
        AND "orderID" = $2;`,
      [userID, orderID]
    );
    if (!productorder) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission Denied" });
    } else if (productorder.orderStatus !== "paid") {
      await client.query("ROLLBACK");
      return res
        .status(403)
        .send({
          message: `Can not set status of this order, Current status '${productorder.orderStatus}'`,
        });
    }
    client.query(
      ` UPDATE productorder
        SET 
          "orderStatus" = 'shipped',
          "deliveryNumber" = ($1),
          "deliveryDate" = $3
        WHERE "orderID" = $2;`,
      [deliveryNumber, orderID, now]
    );

    await client.query("COMMIT");

    return res.status(200).send({ message: "Success", orderID });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
