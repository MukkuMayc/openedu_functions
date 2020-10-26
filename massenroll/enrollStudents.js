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
        body: res.payload,
      }).then((res) => res.json());
    }
  );

  if (res?.status === 0) {
    res.message = `Successfully enrolled in ${course.tag} ${course.session}`;
  } else {
    res.message = "Some error happened";
  }

  return res;
}

export default enrollStudents;
