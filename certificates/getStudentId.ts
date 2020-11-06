import listSessionsPage from "../common/listSessionsPage.js";
import getStudentIdInSession from "./getStudentIdInSession.js";

/**
 * Search for student's id in course's sessions
 * @param email    Email
 * @param fullName Full name of student
 * @param courseId ID of course there we search for student id
 * @param title    Course title, it's needed only for logging
 * @param dates    Dates that presented in course name, sessions with same date will have priority in search
 * @returns Student's id
 */
async function getStudentId(email: string, fullName: {
  name: string;
  surname: string;
  second_name: string;
}, courseId: number, title: string = "", dates: string[] = []): Promise<number | null> {
  let studentId;
  let page = 0;
  let morePages = false;
  do {
    let sessions = await listSessionsPage(courseId, ++page).then((res) => {
      morePages = res.pagination.more;
      return res.results;
    });

    const sessionWithSameDate = sessions.find((session) =>
      dates.find((d) => {
        let match = session.text.match(/\d{2}.\d{2}.\d{4}/);
        return match ? match[0] === d : false;
      })
    );

    if (sessionWithSameDate) {
      try {
        studentId = await getStudentIdInSession(
          email,
          fullName,
          parseInt(sessionWithSameDate.id)
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
        studentId = await getStudentIdInSession(email, fullName, parseInt(session.id));
        console.log(`Found student ${email} at "${title}", "${session.text}"`);
        break;
      } catch (err) {
        if (err.toString() !== "Error: Student was not found") throw err;
        continue;
      }
    }
  } while (!studentId && morePages);
  return studentId || null;
}

export default getStudentId;
