import RequestFormPayload from "../common/RequestFormPayload.js";
import request from "../common/request.js";

/**
 * Form payload for enroll request
 * @param   {number} course     Course id
 * @param   {number} session    Session id
 * @param   {number} enrType Code of enroll type (in practice we always use 13196)
 * @param   {string} students   Students in CSV format
 * @param   {number} univer     University code, SPbU is 6
 * @returns {string}            Payload for enroll request
 */
function formEnrollPayload(course, session, enrType, students, univer = 6) {
  let payload = new RequestFormPayload();
  payload.addField("course", course);
  payload.addField("session", session);
  payload.addField("enrollment_type", enrType);
  payload.addField("students", students, true);
  payload.addField("university", univer);
  payload.addField("skip_group_check", 1, false, true);
  return payload.toString();
}

/**
 * Form payload for enroll request
 * @param   {{
              tag: string;
              session: string;
            }}                  course   Contains information about course: tag (example: phylosophy) and session (example: fall_2020_spbu_spec)
 * @param   {string}            students Students to enroll in CSV format. Only required field: email
 * @returns {Promise<string>}            Payload for enroll request
*/
async function formEnrollPayloadFromCourse(course, students) {
  const university = 6;
  let res = await request(
    `https://openedu.ru/autocomplete/course/?q=${course.tag}&forward={"university":"${university}"}`,
    {
      headers: {
        referer: "https://openedu.ru/upd/spbu/student/massenroll/",
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
        referer: "https://openedu.ru/upd/spbu/student/massenroll/",
      },
    }
  )
    .then((res) => res.json())
    .then((json) => json.results);

  const session = res.find((el) => el.text.includes(course.session))?.id;
  if (!session) {
    throw new Error("Session was not found");
  }

  const enrollType = 13196;

  return formEnrollPayload(courseId, session, enrollType, students, university);
}

export { formEnrollPayload, formEnrollPayloadFromCourse };
