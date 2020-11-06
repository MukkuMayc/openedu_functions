import fetch, { Response as NodeResponse } from "node-fetch";
import parseString from "set-cookie-parser";

const defaultHeaders = {
  "Accept-Language": "en,en-US;q=0.8,ru-RU;q=0.5,ru;q=0.3",
  Cookie: `csrftoken=${process.env.CSRF_TOKEN}; sessionid=${process.env.SESSION_ID}; authenticated=1; authenticated_user=${process.env.AUTHENTICATED_USER}`,
  "X-CSRFToken": process.env.CSRF_TOKEN,
};

/**
 * Wrapper of `fetch` function, add required headers and cookies, handle some errors
 * @param url
 * @param params Parameters of fetch()
 */
async function request(url: string, params: any): Promise<NodeResponse> {
  const { headers, ...others } = params;

  const res = await fetch(url, {
    headers: {
      ...headers,
      ...defaultHeaders,
    },
    ...others,
  });
  const authenticated = parseString(res.headers.raw()["set-cookie"])?.find(
    (el: { name: string }) => el.name === "authenticated"
  )?.value;
  if (authenticated === "0") {
    throw new Error("User is not authenticated");
  }
  if (!res.ok) {
    if (res.status < 400 && res.status >= 300) return res;
    if (res.status === 403) {
      throw new Error(`User is not authenticated`);
    }
    throw new Error(`Request didn't succeed, status code is ${res.status}`);
  }
  return res;
}

export default request;
