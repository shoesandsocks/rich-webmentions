// https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
import client from "./database.js";

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
