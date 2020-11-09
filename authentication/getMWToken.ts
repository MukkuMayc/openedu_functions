import fetch from "node-fetch";
import { Cookies } from "./authentificate";
import cheerio from "cheerio";

async function getMWToken(cookies: Cookies) {
  return await fetch("https://openedu.ru/upd/spbu/student/massinvite/", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0",
      cookie: [...cookies].map((el) => `${el[0]}=${el[1]}`).join(";"),
      referer: "https://openedu.ru/upd/spbu/student/massinvite/",
    },
    redirect: "manual",
  })
    .then((res) => {
      return res.text();
    })
    .then((page) => {
      let $ = cheerio.load(page);
      let res = $("form#main_form [name=csrfmiddlewaretoken]").attr("value");
      return res || "";
    });
}

export default getMWToken;
