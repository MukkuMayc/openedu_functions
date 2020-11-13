import cheerio from "cheerio";
import fetch, { Response } from "node-fetch";
import parseString from "set-cookie-parser";

/**
 * Receive csrftoken and csrfmiddlewaretoken from login page
 */
async function getTokens() {
  const tokens = {
    CSRFToken: "",
    middlewaretoken: "",
  };
  await fetch("https://sso.openedu.ru/login/")
    .then((res: Response) => {
      tokens.CSRFToken =
        parseString(res.headers.raw()["set-cookie"] || "").find(
          (el) => el.name === "csrftoken"
        )?.value || "";
      return res.text();
    })
    .then((page) => {
      tokens.middlewaretoken =
        cheerio
          .load(page)("form#login_auth [name=csrfmiddlewaretoken]")
          .attr("value") || "";
    });

  return tokens;
}

export default getTokens;
