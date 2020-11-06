import studentsSelector from "./studentsSelector";
import getStudentIdBF from "./getStudentIdBF";


/**
 * Search for the student's id in the session
 * @param email    Student's email
 * @param fullName Full name of the student
 * @param session  Session's id
 * @returns Student's id
 */
async function getStudentIdInSession(email: string, fullName: {
  name: string;
  surname: string;
  second_name: string;
}, session: number): Promise<number> {
  const handleResult = (email: string, res: { data: string[][] }): number | null => {
    if (!(res.data.length > 0)) return null;
    const id = res.data.find((el: string[]) => el[1] === email);
    return id ? parseInt(id[5]) : null;
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

  if (id === null) throw Error("Student was not found");
  return id;
}

export default getStudentIdInSession;
