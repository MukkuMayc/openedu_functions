import RequestFormPayload from "../common/RequestFormPayload.js";
import request from "../common/request.js";

/**
 * Form payload for unenroll request
 * @param   {number} course   Course id
 * @param   {number} session  Session id
 * @param   {string} reason   Reason for unenrolling
 * @param   {string} students Students in CSV format
 * @param   {number} univer   University code, SPbU is 6
 * @returns {string}          Payload for unenroll request
 */
function formUnenrollPayload(course, session, reason, students, univer = 6) {
  let payload = new RequestFormPayload();
  payload.addField("course", course);
  payload.addField("session", session);
  payload.addField("reason", reason);
  payload.addField("students", students, true);
  payload.addField("university", univer);
  payload.addField("skip_group_check", 1, false, true);
  return payload.toString();
}

/**
 * Form payload for unenroll request
 * @param   {{
              tag: string;
              session: string;
            }}                  course   Contains information about course: tag (example: phylosophy) and session (example: fall_2020_spbu_spec)
 * @param   {string}            students Students to unenroll in CSV format. Only required field: email
 * @returns {Promise<string>}            Payload for unenroll request
 */
async function formUnenrollPayloadFromCourse(course, students) {
  const university = 6;
  let res = await request(
    `https://openedu.ru/autocomplete/course/?q=${course.tag}&forward={"university":"${university}"}`,
    {
      headers: {
        referer: "https://openedu.ru/upd/spbu/student/massunenroll/",
      },
    }
  )
    .then((res) => res.json())
    .then((json) => json.results);

  if (!(res?.length > 0)) {
    throw new Error("Course was not found");
  }

  const courseId = res[0].id;

  res = await request(
    `https://openedu.ru/autocomplete/session/active?forward={"course":"${courseId}","university":"${university}"}`,
    {
      headers: {
        referer: "https://openedu.ru/upd/spbu/student/massunenroll/",
      },
    }
  )
    .then((res) => res.json())
    .then((json) => json.results);

  const session = res.find((el) => el.text.includes(course.session))?.id;
  if (!session) {
    throw new Error("Session was not found");
  }

  const reason = "Why not";

  return formUnenrollPayload(courseId, session, reason, students, university);
}

export { formUnenrollPayload, formUnenrollPayloadFromCourse };
