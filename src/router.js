import { Router } from "express";
import wmverifier from "webmention-verifier";
import client from "./database.js";
import msg from "./notify.js";

const { ACCEPTABLE_HOSTS, NOTIFY_URL } = process.env;

const r = Router();

r.get("/", (req, res) => {
  res.send("This is the webmention server for www.rich-text.net.");
});
r.post("/discord-interaction", async (req, res) => {
  console.log(req.params);
});
r.post("/webmention", async (req, res) => {
  const { source, target } = req.body;
  const wm = await wmverifier(source, target, ACCEPTABLE_HOSTS);
  if (wm.statusCode == 200) {
    res.sendStatus(202);
    const coll = await client.db("blogStuff").collection("webmentions");
    coll.insertOne(wm.webmention); // don't save the whole object from wmverifier, just the mention
    return msg(NOTIFY_URL, "new webmention; run ./scripts/rebuild to set.");
  }
  return res.status(wm.statusCode).send(wm.body);
});

export default r;
