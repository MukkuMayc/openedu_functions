import fetch from "node-fetch";
import { defaultHeaders } from "../Config.js";
import { formEnrollPayloadFromCourse } from "./enrollPayload.js";

async function enrollStudents(course, students) {
  const res = await formEnrollPayloadFromCourse(course, students).then(
    (res) => {
      return fetch("https://openedu.ru/upd/spbu/student/massenroll/", {
        headers: {
          ...defaultHeaders,
          "Content-Type":
            "multipart/form-data; boundary=---------------------------myform",
          referer: "https://openedu.ru/upd/spbu/student/massenroll/",
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

export default enrollStudents;
