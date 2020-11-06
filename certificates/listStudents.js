import request from "../common/request.js";

/**
 * Request list of students
 * @param   {number}         session Session's number code
 * @param   {number}         start   Student's number from that we start
 * @returns {Promise<{
 *  data: string[][];
 *  recordsTotal: number;
 *  recordsFiltered: number;
 * }>}                                data: list of students, recordsTotal: how many students in session.
 */
function listStudents(session, start = 0) {
  return request("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    headers: {
      referer: "https://openedu.ru/upd/spbu/students/certificates",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `start=${start}&length=100&session=${session}`,
  }).then((res) => res.json());
}

export default listStudents;
