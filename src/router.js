import { Router } from "express";
import wmverifier from "webmention-verifier";
import client from "./database.js";
import msg from "./notify.js";

const { NOTIFY_URL } = process.env;
// const { ACCEPTABLE_HOSTS, NOTIFY_URL } = process.env;
const r = Router();

r.get("/", (req, res) => {
  res.send("This is the webmention server for www.rich-text.net.");
});

r.post("/webmention", async (req, res) => {
  try {
    const { source, target } = req.body;
    const wm = await wmverifier(source, target);
    // const wm = await wmverifier(source, target, ACCEPTABLE_HOSTS);
    if (wm.statusCode == 200) {
      res.sendStatus(202);
      const coll = await client.db("blogStuff").collection("webmentions");
      coll.insertOne(wm.webmention); // don't save the whole object from wmverifier, just the mention
      return msg(NOTIFY_URL, "new webmention; run ./scripts/rebuild to set.");
    }
    res.status(wm.statusCode).send(wm.body);
    return msg(
      NOTIFY_URL,
      `webmention failed (but didn't throw). Verifier says: "${wm.body}" Source was "${source}", target was "${target}"`
    );
  } catch (error) {
    return msg(NOTIFY_URL, error);
  }
});

export default r;
