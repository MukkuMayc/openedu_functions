import listSessionsPage from "../common/listSessionsPage.js";
import getStudentIdInSession from "./getStudentIdInSession.js";

/**
 * Search for student's id in course's sessions
 * @param   {string}             email    Email
 * @param   {{
 *          name: string;
 *          surname: string;
 *          second_name: string;
 *          }}                   fullName   Full name of student
 * @param   {number}             courseId ID of course there we search for student id
 * @param   {string}             title    Course title, it's needed only for logging
 * @param   {string[]}           dates    Dates that presented in course name, sessions with same date will have priority in search
 * @returns {Promise<number>}                      Student's id
 */
async function getStudentId(email, fullName, courseId, title = "", dates = []) {
  let studentId;
  let page = 0;
  let morePages = false;
  do {
    let sessions = await listSessionsPage(courseId, ++page).then((res) => {
      morePages = res.pagination.more;
      return res.results;
    });

    let sessionWithSameDate = sessions.find((session) =>
      dates.find((d) => d === session.text.match(/\d{2}.\d{2}.\d{4}/g)[0])
    );

    if (sessionWithSameDate) {
      try {
        studentId = await getStudentIdInSession(
          email,
          fullName,
          sessionWithSameDate.id
        );
        console.log(
          `Found student ${email} at "${title}", "${sessionWithSameDate.text}"`
        );
        break;
      } catch (err) {
        if (err.toString() !== "Error: Student was not found") throw err;
      }
      sessions.splice(
        sessions.findIndex((el) => el.id === sessionWithSameDate.id),
        1
      );
    }

    for (const session of sessions) {
      try {
        studentId = await getStudentIdInSession(email, fullName, session.id);
        console.log(`Found student ${email} at "${title}", "${session.text}"`);
        break;
      } catch (err) {
        if (err.toString() !== "Error: Student was not found") throw err;
        continue;
      }
    }
  } while (!studentId && morePages);
  return studentId;
}

export default getStudentId;
