import "dotenv/config";
import Express, { urlencoded } from "express";
import fetch from "node-fetch";
import wmverifier from "webmention-verifier";
import { MongoClient } from "mongodb";

/* helper funcs */
const msg = (url, text) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: { "Content-Type": "application/json" },
  }).catch((err) => console.log(err));
};

// https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
function handle(signal) {
  console.log(`*^!@4=> Received event: ${signal}`);
}
async function closeGracefully(signal) {
  console.log(`*^!@4=> Received signal to terminate: ${signal}`);
  // await other things we should cleanup nicely
  await client.close();
  process.exit();
}
process.on("SIGINT", closeGracefully);
process.on("SIGTERM", closeGracefully);
process.on("SIGHUP", handle);

/* connect to DB */
const { NODE_ENV, MONGO_USER, MONGO_PW } = process.env;
const root = NODE_ENV === "production" ? `mongodb` : `23.239.11.32:27017`;
const uri = `mongodb://${MONGO_USER}:${MONGO_PW}@${root}/colorshare?authSource=admin`;
const client = new MongoClient(uri);

await client.connect();

/* begin express routing */

const { NOTIFY_URL } = process.env;
// const { ACCEPTABLE_HOSTS, NOTIFY_URL } = process.env;
const app = Express();
app.use(urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("This is the webmention server for www.rich-text.net.");
});

app.post("/webmention", async (req, res) => {
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

app.listen(process.env.PORT, () =>
  console.log(`webmention server listening on ${process.env.PORT}`)
);
