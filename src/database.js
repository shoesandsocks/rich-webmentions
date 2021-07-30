import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

const { NODE_ENV, MONGO_USER, MONGO_PW } = process.env;

const domain = NODE_ENV === "production" ? `mongodb` : `23.239.11.32:27017`;
const uri = `mongodb://${MONGO_USER}:${MONGO_PW}@${domain}/colorshare?authSource=admin`;

const client = new MongoClient(uri);

export default client;
