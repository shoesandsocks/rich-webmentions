import client from "./database.js";

async function saveObject(obj) {
  await client.connect();
  const mentionsColl = client.db("blogStuff").collection("webmentions");
  const operation = await mentionsColl.insertOne(obj);
  console.log(`db operation complete: ${operation}`);
  return;
}

function processWebmention({ statusCode, body, webmention }) {
  if (statusCode !== 200) return console.error("failed to verify");
  console.log(`processing webmention: ${body}`);
  saveObject(webmention);
}

export default processWebmention;

/**temporary, to put my existing wm archive into database */

// import { archive } from "../temp/webmentionArchive.js";
// processWebmention({ statusCode: 200, body: "", webmention: archive });
