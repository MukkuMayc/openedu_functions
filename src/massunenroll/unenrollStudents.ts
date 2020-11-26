import request from "../common/request";
import { CourseInfo } from "../common/types";
import { formUnenrollPayloadFromCourse } from "./unenrollPayload";

/**
 *  Make an unenroll request
 * @param course   Contains information about course: tag (example: phylosophy) and session (example: fall_2020_spbu_spec)
 * @param students Students to unenroll in CSV format. Only required field: email
 * @returns JSON from server with status and redirect fields. If request is successful, status will be 0.
 */
async function unenrollStudents(
  course: CourseInfo,
  students: string
): Promise<{ status: number; redirect: string }> {
  const payload = await formUnenrollPayloadFromCourse(course, students);

  const res = await request(
    "https://openedu.ru/upd/spbu/student/massunenroll/",
    {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=---------------------------myform",
        referer: "https://openedu.ru/upd/spbu/student/massunenroll/",
      },
      method: "POST",
      body: payload,
    }
  ).then((res) => {
    if (res.status !== 200) {
      throw new Error(`Request didn't succeed, status code is ${res.status}`);
    }
    return res.json();
  });

  return res;
}

export default unenrollStudents;
