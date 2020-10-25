import {
  formEnrollPayload,
  formEnrollPayloadFromCourse,
} from "./enrollPayload.js";

test("Form enroll payload from through parameters", () => {
  const payload =
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="csrfmiddlewaretoken"\r\n' +
    `\r\n${process.env.CSRF_MIDDLEWARE_TOKEN}\r\n` +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="course"\r\n' +
    "\r\n" +
    "532\r\n" +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="session"\r\n' +
    "\r\n" +
    "345\r\n" +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="enrollment_type"\r\n' +
    "\r\n" +
    "54\r\n" +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="students"; filename="somefile.csv"\r\n' +
    "Content-Type: text/csv\r\n" +
    "\r\n" +
    "hoYNcpSVka@CFuJ.ru\r\n" +
    "CMIqskTRKD@ESxX.ru\r\n" +
    "ncNQPMFgGD@zGpt.ru\r\n" +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="university"\r\n' +
    "\r\n" +
    "6\r\n" +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="skip_group_check"\r\n' +
    "\r\n" +
    "1\r\n" +
    "-----------------------------myform\r\n";

  expect(
    formEnrollPayload(
      532,
      345,
      54,
      "hoYNcpSVka@CFuJ.ru\r\nCMIqskTRKD@ESxX.ru\r\nncNQPMFgGD@zGpt.ru",
      6
    )
  ).toBe(payload);
});
