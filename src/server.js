import Express, { urlencoded } from "express";

import "./node.js";
import r from "./router.js";

const app = Express();

app.use(urlencoded({ extended: false }));
app.use(r);

app.listen(process.env.PORT, () =>
  console.log(`webmention server listening on ${process.env.PORT}`)
);
