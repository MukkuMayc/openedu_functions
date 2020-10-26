import fetch from "node-fetch";
import { defaultHeaders } from "../Config.js";
import { formEnrollPayloadFromCourse } from "./enrollPayload.js";

async function enrollStudents(course, students) {
  const res = await formEnrollPayloadFromCourse(course, students).then(
    (res) => {
      if (res.status !== 0) {
        return res;
      }

      return fetch("https://openedu.ru/upd/spbu/student/massenroll/", {
        headers: {
          ...defaultHeaders,
          "Content-Type":
            "multipart/form-data; boundary=---------------------------myform",
          referer: "https://openedu.ru/upd/spbu/student/massenroll/",
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
    message: `Successfully enrolled in ${course.tag} ${course.session}`,
  };
}

export default enrollStudents;
