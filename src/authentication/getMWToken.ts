import request from "../common/request";
import cheerio from "cheerio";

async function getMWToken() {
  return await request("https://openedu.ru/upd/spbu/student/massinvite/", {
    headers: {
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
