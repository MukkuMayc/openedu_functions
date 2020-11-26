import parseString from "set-cookie-parser";
import fetch, { Response as NodeResponse } from "node-fetch";
import getTokens from "./getTokens";
import { DefaultError, ErrorType } from "../common/errors";

class Cookies extends Map<string, string> {}

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
    const result = domains.find((d) => d.domain === "openedu.ru")!.cookies;
    if (result.get("authenticated") === "0") {
      throw new DefaultError(ErrorType.AUTHENTICATION_FAILED);
    }
    return domains.find((d) => d.domain === "openedu.ru")!.cookies;
  }

  if (res.status >= 400) {
    let text = await res.text();
    throw Error(`Some error while authenticating\n${text}`);
  }

  if (!headers.location) {
    throw Error(`Don't know where to redirect, ${JSON.stringify(headers)}`);
  }

  return await fetch(headers.location[0], {
    headers: {
      Cookie: [...cookies].map((el) => `${el[0]}=${el[1]}`).join("; "),
      referer: "https://sso.openedu.ru",
    },
    redirect: "manual",
  }).then((res) => handleResponse(res, domains));
}

/**
 * Authenticate user, return cookies for openedu.ru
 * @param username usename or email
 */
async function authenticate(username: string, password: string) {
  const cookies: Cookies = new Cookies();
  const tokens = await getTokens();
  cookies.set("csrftoken", tokens.CSRFToken);
  cookies.set("authenticated", "0");
  cookies.set("authenticated_user", "Anonymous");

  const domains = [
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
      Cookie: [...cookies].map((el) => `${el[0]}=${el[1]}`).join(";"),
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: "https://sso.openedu.ru/login/",
    },
    redirect: "manual",
    body: `csrfmiddlewaretoken=${tokens.middlewaretoken}&username=${username}&password=${password}`,
  }).then((res) => handleResponse(res, domains));
}

export { Cookies };
export default authenticate;
