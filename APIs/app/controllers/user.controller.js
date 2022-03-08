const { pool } = require("../config/db.config");
const qs = require("qs");

exports.editAvatar = async (req, res) => {
  const { userID, files } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    if (!files) {
      await client.query("ROLLBACK");
      return res.status(400).send({ message: "No media file" });
    }
    const { media } = await files;
    var image;
    if (media.length) {
      image = media[0];
    } else {
      image = media;
    }
    if (!image.name.match(/\.(jpg|jpeg|png)$/i)) {
      await client.query("ROLLBACK");
      return res.status(415).send({ message: "wrong file type" });
    }
    if (image.truncated) {
      await client.query("ROLLBACK");
      return res.status(413).send({ message: "file too large" });
    }
    const imageBase64 = image.data.toString("base64");
    await client.query(
      `
        UPDATE userDetail 
        SET "avatar" = ($2)
        WHERE "userID" = ($1)`,
      [userID, imageBase64]
    );

    await client.query("COMMIT");
    return res.status(200).send({ message: "ok", image: imageBase64 });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
