import { MongoClient } from "mongodb";
import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

const { NODE_ENV, MONGO_USER, MONGO_PW } = process.env;
console.log(NODE_ENV);
const root = NODE_ENV === "production" ? `mongodb` : `23.239.11.32:27017`;
const uri = `mongodb://${MONGO_USER}:${MONGO_PW}@${root}/colorshare?authSource=admin`;
const client = new MongoClient(uri);

await client.connect();

export default client;
