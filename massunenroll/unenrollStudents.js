import request from "../common/request.js";
import { formUnenrollPayloadFromCourse } from "./unenrollPayload.js";

/**
 *  Make an unenroll request
 * @param {{
            tag: string;
            session: string;
          }}                  course   Contains information about course: tag (example: phylosophy) and session (example: fall_2020_spbu_spec)
 * @param   {string}          students Students to unenroll in CSV format. Only required field: email
 * @returns {Promise<{status: number; redirect: string}>}             JSON from server with status and redirect fields. If request is successful, status will be 0.
 */
async function unenrollStudents(course, students) {
  const res = await formUnenrollPayloadFromCourse(course, students).then(
    (res) => {
      return request("https://openedu.ru/upd/spbu/student/massunenroll/", {
        headers: {
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
