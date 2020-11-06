import listStudents from "./listStudents.js";

/**
 * Brute force all students to find one with same email and returns id
 * @param session Session's id
 * @param email   Student's email
 * @returns Student's id
 */
async function getStudentIdBF(email: string, session: number): Promise<number | null> {
  let st: string[] | null = null;
  let students = await listStudents(session);
  const total = students.recordsTotal;
  let data = students.data;
  st = data.find((st: string[]) => st[1] === email) || null;
  if (!st) {
    for (let i = 100; i < total; i += 100) {
      data = (await listStudents(session, i)).data;
      st = data.find((st: string[]) => st[1] === email) || null;
      if (st) break;
    }
  }
  return st ? parseInt(st[5]) : null;
}

export default getStudentIdBF;
