import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

const { NODE_ENV, MONGO_USER, MONGO_PW } = process.env;
const root = NODE_ENV === "production" ? `mongodb` : `23.239.11.32:27017`;
const uri = `mongodb://${MONGO_USER}:${MONGO_PW}@${root}/colorshare?authSource=admin`;
const client = new MongoClient(uri);

await client.connect();

export default client;
