import fetch from "node-fetch";
import { defaultHeaders } from "../Config.js";
import { formUnenrollPayloadFromCourse } from "./unenrollPayload.js";

async function unenrollStudents(course, students) {
  const res = await formUnenrollPayloadFromCourse(course, students).then(
    (payload) => {
      return fetch("https://openedu.ru/upd/spbu/student/massunenroll/", {
        headers: {
          ...defaultHeaders,
          "Content-Type":
            "multipart/form-data; boundary=---------------------------myform",
          referer: "https://openedu.ru/upd/spbu/student/massunenroll/",
        },
        method: "POST",
        body: payload,
      }).then((res) => res.json());
    }
  );

  if (res.status === 0) {
    console.log("Successfully unenrolled in", course.tag, course.session);
  } else {
    console.log(res.status, "Some error happened");
  }

  return res;
}

export default unenrollStudents;
