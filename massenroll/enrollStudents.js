import fetch from "node-fetch";
import { defaultHeaders } from "../Config.js";
import { formEnrollPayloadFromCourse } from "./enrollPayload.js";

async function enrollStudents(course, students) {
  const res = await formEnrollPayloadFromCourse(course, students).then(
    (payload) => {
      return fetch("https://openedu.ru/upd/spbu/student/massenroll/", {
        headers: {
          ...defaultHeaders,
          "Content-Type":
            "multipart/form-data; boundary=---------------------------myform",
        },
        method: "POST",
        body: payload,
        referer: "https://openedu.ru/upd/spbu/student/massenroll/",
      }).then((res) => res.json());
    }
  );

  if (res.status === 0) {
    console.log("Successfully enrolled in", course.tag, course.session);
  } else {
    console.log(res.status, "Some error happened");
  }

  return res;
}

export default enrollStudents;
