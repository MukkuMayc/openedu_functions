export const defaultHeaders = {
  "Accept-Language": "en,en-US;q=0.8,ru-RU;q=0.5,ru;q=0.3",
  Cookie: `csrftoken=${process.env.CSRF_TOKEN}; sessionid=${process.env.SESSION_ID}; authenticated=1; authenticated_user=${process.env.AUTHENTICATED_USER}`,
  "X-CSRFToken": process.env.CSRF_TOKEN,
};
