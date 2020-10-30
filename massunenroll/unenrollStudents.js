import fetch from "node-fetch";
import { defaultHeaders } from "../Config.js";
import { formUnenrollPayloadFromCourse } from "./unenrollPayload.js";

async function unenrollStudents(course, students) {
  const res = await formUnenrollPayloadFromCourse(course, students).then(
    (res) => {
      return fetch("https://openedu.ru/upd/spbu/student/massunenroll/", {
        headers: {
          ...defaultHeaders,
          "Content-Type":
            "multipart/form-data; boundary=---------------------------myform",
          referer: "https://openedu.ru/upd/spbu/student/massunenroll/",
        },
        method: "POST",
        body: res,
      }).then((res) => {
        if (res.status !== 200) {
          throw new Error(
            `Request didn't succeed, status code is ${res.status}`
          );
        }
        return res.json();
      });
    }
  );

  return res;
}

export default unenrollStudents;
