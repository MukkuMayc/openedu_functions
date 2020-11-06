import studentsSelector from "./studentsSelector.js";
import getStudentIdBF from "./getStudentIdBF.js";

/**
 * Search for the student's id in the session
 * @param   {string}               email    Student's email
 * @param   {{
 *  name: string;
 *  surname: string;
 *  second_name: string;
 * }}                              fullName Full name of the student
 * @param   {number}               session  Session's id
 * @returns {Promise<number>}               Student's id
 */
async function getStudentIdInSession(email, fullName, session) {
  const handleResult = (email, res) => {
    if (!(res.data.length > 0)) return null;
    return res.data.find((el) => el[1] === email)[5];
  };

  let id = await studentsSelector(email, session).then((res) =>
    handleResult(email, res)
  );

  id =
    id ||
    (await studentsSelector(
      `${fullName.name} ${fullName.surname} ${fullName.second_name}`,
      session
    ).then((res) => handleResult(email, res)));

  id = id || (await getStudentIdBF(email, session));

  if (!id) throw Error("Student was not found");
  return id;
}

export default getStudentIdInSession;
