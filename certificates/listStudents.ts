import request from "../common/request";

/**
 * Request list of students
 * @param session Session's number code
 * @param start   Student's number from that we start
 * @returns data: list of students, recordsTotal: how many students in session.
 */
async function listStudents(session: number, start: number = 0): Promise<{
  data: string[][];
  recordsTotal: number;
  recordsFiltered: number;
}> {
  const res = await request("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    headers: {
      referer: "https://openedu.ru/upd/spbu/students/certificates",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `start=${start}&length=100&session=${session}`,
  });
  return await res.json();
}

export default listStudents;
