import fs from "fs";

function saveEnv() {
  return new Promise((resolve) =>
    fs.writeFile(
      ".env",
      `CSRF_TOKEN=${process.env.CSRF_TOKEN}
CSRF_MIDDLEWARE_TOKEN=${process.env.CSRF_MIDDLEWARE_TOKEN}
AUTHENTICATED_USER=${process.env.AUTHENTICATED_USER}
SESSION_ID=${process.env.SESSION_ID}`,
      resolve
    )
  );
}

export default saveEnv;
