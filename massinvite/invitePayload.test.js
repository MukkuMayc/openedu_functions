import formInvitePayload from "./invitePayload.js";

test("Form invite payload with one user", () => {
  const payload =
    '-----------------------------myform\r\nContent-Disposition: form-data; name="csrfmiddlewaretoken"\r\n\r\nSikIkbBTaVNX4GEgUsxeBysi8ZgEf0LEkdkMsYhfJxEZTtQBJ6430eFMwKvdU0zG\r\n-----------------------------myform\r\nContent-Disposition: form-data; name="csv"; filename="somefile.csv"\r\nContent-Type: text/csv\r\n\r\nVgTjuhPi;GXbJskHnAf@Osuu.ru;CmKHzu;tQfNvF;;;\r\n-----------------------------myform\r\n';
  expect(
    formInvitePayload("VgTjuhPi;GXbJskHnAf@Osuu.ru;CmKHzu;tQfNvF;;;")
  ).toBe(payload);
});

test("Form invite payload with multiple users", () => {
  const payload =
    '-----------------------------myform\r\nContent-Disposition: form-data; name="csrfmiddlewaretoken"\r\n\r\nSikIkbBTaVNX4GEgUsxeBysi8ZgEf0LEkdkMsYhfJxEZTtQBJ6430eFMwKvdU0zG\r\n-----------------------------myform\r\nContent-Disposition: form-data; name="csv"; filename="somefile.csv"\r\nContent-Type: text/csv\r\n\r\neLtKJ08l;mHxnAsGMle@KbDk.ru;dQeFkJ;EAoCAV;;;\r\nwW1UGIEj;xmYPHmmUdV@mruW.ru;TqJtBB;KIPCHy;;;\r\n9P6a3YKU;lbpZyEsobR@GBgF.ru;oagUaT;WCHvFO;;;\r\ndvRL1O0K;UQPZGalyzI@KXEB.ru;EtITwe;gjuqKR;;;\r\nAQ2Hi25R;GQiaLHYJam@aswS.ru;KztTzT;woUPuT;;;\r\n-----------------------------myform\r\n';
  expect(
    formInvitePayload(
      "eLtKJ08l;mHxnAsGMle@KbDk.ru;dQeFkJ;EAoCAV;;;\r\nwW1UGIEj;xmYPHmmUdV@mruW.ru;TqJtBB;KIPCHy;;;\r\n9P6a3YKU;lbpZyEsobR@GBgF.ru;oagUaT;WCHvFO;;;\r\ndvRL1O0K;UQPZGalyzI@KXEB.ru;EtITwe;gjuqKR;;;\r\nAQ2Hi25R;GQiaLHYJam@aswS.ru;KztTzT;woUPuT;;;"
    )
  ).toBe(payload);
});
