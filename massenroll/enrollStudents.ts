import request from "../common/request";
import { formEnrollPayloadFromCourse } from "./enrollPayload";

/**
 *  Make an enroll request
 * @param course   Contains information about course: tag (example: phylosophy) and session (example: fall_2020_spbu_spec)
 * @param students Students to enroll in CSV format. Only required field: email
 * @returns JSON from server with status and redirect fields. If request is successful, status will be 0.
 */
async function enrollStudents(course: {
  tag: string;
  session: string;
}, students: string): Promise<{ status: number; redirect: string; }> {
  const res = await formEnrollPayloadFromCourse(course, students).then(
    async (res) => {
      const res_1 = await request("https://openedu.ru/upd/spbu/student/massenroll/", {
        headers: {
          "Content-Type": "multipart/form-data; boundary=---------------------------myform",
          referer: "https://openedu.ru/upd/spbu/student/massenroll/",
        },
        method: "POST",
        body: res,
      });
      if (res_1.status !== 200) {
        throw new Error(
          `Request didn't succeed, status code is ${res_1.status}`
        );
      }
      return res_1.json();
    }
  );

  return res;
}

export default enrollStudents;
