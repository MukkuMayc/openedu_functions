// import request from "../common/request";
import parseString from "set-cookie-parser";
import fetch, { Response as NodeResponse } from "node-fetch";
import cheerio from "cheerio";

type Cookies = Map<string, string>;

/**
 * Receive csrftoken and csrfmiddlewaretoken from login page
 */
async function getTokens() {
  const tokens = {
    CSRFToken: "",
    middlewaretoken: "",
  };
  await fetch("https://sso.openedu.ru/login/")
    .then((res) => {
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

/**
 * Handle redirecting response from server, save cookies and make next request
 * @param res Response from server
 */
async function handleResponse(
  res: NodeResponse,
  domains: {
    domain: string;
    cookies: Cookies;
  }[]
): Promise<Cookies> {
  const headers = res.headers.raw();
  // set cookies
  const url = new URL(res.url);
  const dom = domains.find((d) => d.domain === url.host);
  if (!dom) throw Error(`Not found cookies for ${url.host}`);

  parseString(headers["set-cookie"] || "").forEach((el) =>
    el.domain === ".openedu.ru"
      ? domains.forEach((d) => d.cookies.set(el.name, el.value))
      : dom.cookies.set(el.name, el.value)
  );

  const cookies = domains.find(
    (d) =>
      d.domain ===
      new URL(headers.location ? headers.location[0] : res.url).host
  )?.cookies;

  if (!cookies) {
    throw Error(`No cookies for ${new URL(headers.location[0]).host}`);
  }

  // if ok, return cookies
  if (res.ok) {
    return domains.find((d) => d.domain === "openedu.ru")!.cookies;
  }

  if (res.status >= 400) {
    let text = await res.text();
    throw Error(`Some error while authenticating\n${text}`);
  }

  if (!headers.location) {
    throw Error(`Don't know where to redirect, ${JSON.stringify(headers)}`);
  }

  let cookiesStr = [...cookies].map((el) => `${el[0]}=${el[1]}`).join("; ");
  return await fetch(headers.location[0], {
    headers: {
      Cookie: cookiesStr,
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0",
      "Accept-Encoding": "gzip, deflate, br",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en,en-US;q=0.8,ru-RU;q=0.5,ru;q=0.3",
      "Upgrade-Insecure-Requests": "1",
      Connection: "keep-alive",
      referer: "https://sso.openedu.ru",
    },
    redirect: "manual",
  }).then((res) => handleResponse(res, domains));
}

async function login(
  username: string,
  password: string,
  middlewaretoken: string,
  cookies: Cookies
) {
  let cookiesStr = [...cookies].map((el) => `${el[0]}=${el[1]}`).join(";");
  const params = new URLSearchParams();
  params.append("csrfmiddlewaretoken", middlewaretoken);
  params.append("username", username);
  params.append("password", password);
  const domains: {
    domain: string;
    cookies: Cookies;
  }[] = [
    {
      domain: "sso.openedu.ru",
      cookies: cookies,
    },
    {
      domain: "openedu.ru",
      cookies: new Map(),
    },
  ];

  return await fetch("https://sso.openedu.ru/login/", {
    method: "post",
    headers: {
      Cookie: cookiesStr,
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: "https://sso.openedu.ru/login/",
      Connection: "keep-alive",
    },
    redirect: "manual",
    body: params.toString(),
  }).then((res) => handleResponse(res, domains));
}

async function authenticate(username: string, password: string) {
  const cookies: Cookies = new Map();
  const tokens = await getTokens();
  cookies.set("csrftoken", tokens.CSRFToken);
  cookies.set("authenticated", "0");
  cookies.set("authenticated_user", "Anonymous");

  return await login(username, password, tokens.middlewaretoken, cookies);
}

export { Cookies };
export default authenticate;
