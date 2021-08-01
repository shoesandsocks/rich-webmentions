import fetch from "node-fetch";
import { exec } from "child_process";

const msg = (url, text) => {
  fetch(url, {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: { "Content-Type": "application/json" },
  })
    .then(() => {
      exec(process.env.REBUILD_COMMAND, (err, stdout, stderr) => {
        if (err) return console.error(err);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        return;
      });
    })
    .catch((err) => console.log(err));
};

export default msg;
