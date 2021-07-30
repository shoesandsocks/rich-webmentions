import client from "./database.js";

async function saveObject(obj) {
  const mentionsColl = await client.db("blogStuff").collection("webmentions");
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
