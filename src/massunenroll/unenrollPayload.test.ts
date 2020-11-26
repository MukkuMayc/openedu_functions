import {
  formUnenrollPayload,
  formUnenrollPayloadFromCourse,
} from "./unenrollPayload";

test("Unenrollment payload from parameters", () => {
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
    'Content-Disposition: form-data; name="reason"\r\n' +
    "\r\n" +
    "whynot\r\n" +
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
    formUnenrollPayload(
      532,
      345,
      "hoYNcpSVka@CFuJ.ru\r\nCMIqskTRKD@ESxX.ru\r\nncNQPMFgGD@zGpt.ru",
      "whynot",
      6
    )
  ).toBe(payload);
});

test("Unenrollment payload only from course and session", async () => {
  const payload =
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="csrfmiddlewaretoken"\r\n' +
    "\r\n" +
    `${process.env.CSRF_MIDDLEWARE_TOKEN}\r\n` +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="course"\r\n' +
    "\r\n" +
    "287\r\n" +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="session"\r\n' +
    "\r\n" +
    "10002\r\n" +
    "-----------------------------myform\r\n" +
    'Content-Disposition: form-data; name="reason"\r\n' +
    "\r\n" +
    "Why not\r\n" +
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

  return expect(
    formUnenrollPayloadFromCourse(
      { identificator: "phylosophy", session: "fall_2020_spbu_spec" },
      "hoYNcpSVka@CFuJ.ru\r\nCMIqskTRKD@ESxX.ru\r\nncNQPMFgGD@zGpt.ru"
    )
  ).resolves.toBe(payload);
});

test("Unenrollment payload from nonexistent course", async () => {
  return expect(
    formUnenrollPayloadFromCourse(
      { identificator: "nonexistent_course", session: "fall_2020_spbu_spec" },
      "hoYNcpSVka@CFuJ.ru\r\nCMIqskTRKD@ESxX.ru\r\nncNQPMFgGD@zGpt.ru"
    )
  ).rejects.toThrow("Course was not found");
});

test("Unenrollment payload from nonexistent session", async () => {
  return expect(
    formUnenrollPayloadFromCourse(
      { identificator: "phylosophy", session: "nonexistent_session" },
      "hoYNcpSVka@CFuJ.ru\r\nCMIqskTRKD@ESxX.ru\r\nncNQPMFgGD@zGpt.ru"
    )
  ).rejects.toThrow("Session was not found");
});
