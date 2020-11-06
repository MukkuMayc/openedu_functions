import listStudents from "./listStudents.js";

/**
 * Brute force all students to find one with same email and returns id
 * @param   {number}          email   Student's email
 * @param   {number}          session Session's number code
 * @returns {Promise<number>}         Student's id
 */
async function getStudentIdBF(email, session) {
  let st = null;
  let students = await listStudents(session);
  const total = students.recordsTotal;
  students = students.data;
  st = students.find((st) => st[1] === email);
  if (!st) {
    for (let i = 100; i < total; i += 100) {
      students = (await listStudents(session, i)).data;
      st = students.find((st) => st[1] === email);
      if (st) break;
    }
  }
  return st && st[5];
}

export default getStudentIdBF;
