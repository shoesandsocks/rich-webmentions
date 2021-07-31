import Express from "express";
import wmverifier from "webmention-verifier";
import { config } from "dotenv";
config();

import client from "./database.js";

const { PORT, ACCEPTABLE_HOSTS } = process.env;
const app = Express();

app.use(
  Express.urlencoded({
    extended: false,
  })
);

app.get("/", (req, res) => {
  res.send("This is the webmention server for www.rich-text.net.");
});

app.post("/webmention", async (req, res) => {
  const { source, target } = req.body;
  const wm = await wmverifier(source, target, ACCEPTABLE_HOSTS);
  if (wm.statusCode == 200) {
    res.sendStatus(202);
    const coll = await client.db("blogStuff").collection("webmentions");
    coll.insertOne(wm.webmention); // don't save the whole object from wmverifier, just the mention
    return;
  }
  return res.status(wm.statusCode).send(wm.body);
});

// https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
function handle(signal) {
  console.log(`*^!@4=> Received event: ${signal}`);
}
async function closeGracefully(signal) {
  console.log(`*^!@4=> Received signal to terminate: ${signal}`);
  await client.close();
  // await other things we should cleanup nicely
  process.exit();
}

process.on("SIGINT", closeGracefully);
process.on("SIGTERM", closeGracefully);
process.on("SIGHUP", handle);

app.listen(PORT, () => console.log(`webmention server listening on ${PORT}`));
