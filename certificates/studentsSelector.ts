import request from "../common/request.js";

/**
 * Returns students whose parameters contain query as substring;
 * @param substr  Email or name of student
 * @param session Session number code
 * @returns data: list of students, recordsTotal: how many students in session.
 */
async function studentsSelector(substr: string, session: number): Promise<{
  data: string[][];
  recordsTotal: number;
  recordsFiltered: number;
  draw: number;
}> {
  const res = await request("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    // for some emails, it won't find student
    body: `search[value]=${substr}&search[regex]=false&session=${session}`,
    headers: {
      referer: "https://openedu.ru/upd/spbu/students/certificates",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
  return await res.json();
}

export default studentsSelector;
