import {
  formEnrollPayload,
  formEnrollPayloadFromCourse,
} from "./enrollPayload.js";

test("Form enroll payload from through parameters", () => {
  const payload =
    '-----------------------------myform\r\nContent-Disposition: form-data; name="csrfmiddlewaretoken"\r\n\r\nSikIkbBTaVNX4GEgUsxeBysi8ZgEf0LEkdkMsYhfJxEZTtQBJ6430eFMwKvdU0zG\r\n-----------------------------myform\r\nContent-Disposition: form-data; name="course"\r\n\r\n532\r\n-----------------------------myform\r\nContent-Disposition: form-data; name="session"\r\n\r\n345\r\n-----------------------------myform\r\nContent-Disposition: form-data; name="enrollment_type"\r\n\r\n54\r\n-----------------------------myform\r\nContent-Disposition: form-data; name="students"; filename="somefile.csv"\r\nContent-Type: text/csv\r\n\r\nhoYNcpSVka@CFuJ.ru\r\nCMIqskTRKD@ESxX.ru\r\nncNQPMFgGD@zGpt.ru\r\n-----------------------------myform\r\nContent-Disposition: form-data; name="university"\r\n\r\n6\r\n-----------------------------myform\r\nContent-Disposition: form-data; name="skip_group_check"\r\n\r\n1\r\n-----------------------------myform\r\n';
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
