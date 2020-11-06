import formInvitePayload from "./invitePayload";

test("Form invite payload with one user", () => {
  const payload =
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="csrfmiddlewaretoken"\r\n' +
    "\r\n" +
    `${process.env.CSRF_MIDDLEWARE_TOKEN}\r\n` +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="csv"; filename="somefile.csv"\r\n' +
    "Content-Type: text/csv\r\n" +
    "\r\n" +
    "VgTjuhPi;GXbJskHnAf@Osuu.ru;CmKHzu;tQfNvF;;;\r\n" +
    "-----------------------------myform\r\n";
  expect(
    formInvitePayload("VgTjuhPi;GXbJskHnAf@Osuu.ru;CmKHzu;tQfNvF;;;")
  ).toBe(payload);
});

test("Form invite payload with multiple users", () => {
  const payload =
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="csrfmiddlewaretoken"\r\n' +
    "\r\n" +
    `${process.env.CSRF_MIDDLEWARE_TOKEN}\r\n` +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="csv"; filename="somefile.csv"\r\n' +
    "Content-Type: text/csv\r\n" +
    "\r\n" +
    "eLtKJ08l;mHxnAsGMle@KbDk.ru;dQeFkJ;EAoCAV;;;\r\n" +
    "wW1UGIEj;xmYPHmmUdV@mruW.ru;TqJtBB;KIPCHy;;;\r\n" +
    "9P6a3YKU;lbpZyEsobR@GBgF.ru;oagUaT;WCHvFO;;;\r\n" +
    "dvRL1O0K;UQPZGalyzI@KXEB.ru;EtITwe;gjuqKR;;;\r\n" +
    "AQ2Hi25R;GQiaLHYJam@aswS.ru;KztTzT;woUPuT;;;\r\n" +
    "-----------------------------myform\r\n";
  expect(
    formInvitePayload(
      "eLtKJ08l;mHxnAsGMle@KbDk.ru;dQeFkJ;EAoCAV;;;\r\n" +
      "wW1UGIEj;xmYPHmmUdV@mruW.ru;TqJtBB;KIPCHy;;;\r\n" +
      "9P6a3YKU;lbpZyEsobR@GBgF.ru;oagUaT;WCHvFO;;;\r\n" +
      "dvRL1O0K;UQPZGalyzI@KXEB.ru;EtITwe;gjuqKR;;;\r\n" +
      "AQ2Hi25R;GQiaLHYJam@aswS.ru;KztTzT;woUPuT;;;"
    )
  ).toBe(payload);
});
