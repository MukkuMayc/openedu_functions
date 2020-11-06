import RequestFormPayload from "../common/RequestFormPayload";
import request from "../common/request";

/**
 * Form payload for unenroll request
 * @param course   Course id
 * @param session  Session id
 * @param reason   Reason for unenrolling
 * @param students Students in CSV format
 * @param univer   University code, SPbU is 6
 * @returns        Payload for unenroll request
 */
function formUnenrollPayload(
  course: number,
  session: number,
  reason: string,
  students: string,
  univer = 6
): string {
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
async function formUnenrollPayloadFromCourse(
  course: {
    tag: string;
    session: string;
  },
  students: string
): Promise<string> {
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

  const session = res.find((el: { id: number; text: string }) =>
    el.text.includes(course.session)
  )?.id;
  if (!session) {
    throw new Error("Session was not found");
  }

  const reason = "Why not";

  return formUnenrollPayload(courseId, session, reason, students, university);
}

export { formUnenrollPayload, formUnenrollPayloadFromCourse };
