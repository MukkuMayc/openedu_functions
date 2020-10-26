import fetch from "node-fetch";
import { defaultHeaders } from "../Config.js";
import { formUnenrollPayloadFromCourse } from "./unenrollPayload.js";

async function unenrollStudents(course, students) {
  const res = await formUnenrollPayloadFromCourse(course, students).then(
    (res) => {
      if (res.status !== 0) {
        return res;
      }

      return fetch("https://openedu.ru/upd/spbu/student/massunenroll/", {
        headers: {
          ...defaultHeaders,
          "Content-Type":
            "multipart/form-data; boundary=---------------------------myform",
          referer: "https://openedu.ru/upd/spbu/student/massunenroll/",
        },
        method: "POST",
        body: res.payload,
      }).then((res) => {
        if (res.status !== 200) {
          return {
            status: 1,
            message: "Something went wrong in request",
            res,
          };
        }
        return res.json();
      });
    }
  );

  if (res.status !== 0) {
    return res;
  }

  return {
    status: 0,
    message: `Successfully unenrolled from ${course.tag} ${course.session}`,
  };
}

export default unenrollStudents;
