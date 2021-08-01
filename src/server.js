import Express, { urlencoded } from "express";
import { config } from "dotenv";
config();

import "./node.js";
import r from "./router.js";

const { PORT } = process.env;
const app = Express();

app.use(urlencoded({ extended: false }));
app.use(r);

app.listen(PORT, () => console.log(`webmention server listening on ${PORT}`));
