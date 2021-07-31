import fetch from "node-fetch";

const msg = (url, text) => {
  fetch(url, {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: { "Content-Type": "application/json" },
  }).catch((err) => console.log(err));
};

export default msg;
