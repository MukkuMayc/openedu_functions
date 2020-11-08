import RequestFormPayload from "../common/RequestFormPayload";
import request from "../common/request";

/**
 * Form payload for enroll request
 * @param course   Course id
 * @param session  Session id
 * @param enrType  Code of enroll type (in practice we always use 13196)
 * @param students Students in CSV format
 * @param univer   University code, SPbU is 6
 * @returns Payload for enroll request
 */
function formEnrollPayload(
  course: number,
  session: number,
  enrType: number,
  students: string,
  univer: number = 6
): string {
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
 * @param course   Contains information about course: tag (example: phylosophy) and session (example: fall_2020_spbu_spec)
 * @param students Students to enroll in CSV format. Only required field: email
 * @returns Payload for enroll request
*/
async function formEnrollPayloadFromCourse(
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

  const session = res.find((el: { id: number; text: string }) =>
    el.text.includes(course.session)
  )?.id;
  if (!session) {
    throw new Error("Session was not found");
  }

  const enrollType = 13196;

  return formEnrollPayload(courseId, session, enrollType, students, university);
}

export { formEnrollPayload, formEnrollPayloadFromCourse };
