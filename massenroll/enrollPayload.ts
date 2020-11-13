import RequestFormPayload from "../common/RequestFormPayload";
import findCourse from "../common/findCourse";
import findSession from "../common/findSession";

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
  students: string,
  enrType = 13196,
  univer = 6
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
 * @param courseInfo Contains information about course: tag (example: phylosophy) and session (example: fall_2020_spbu_spec)
 * @param students   Students to enroll in CSV format. Only required field: email
 * @returns Payload for enroll request
 */
async function formEnrollPayloadFromCourse(
  courseInfo: {
    identificator: string;
    session: string;
  },
  students: string
): Promise<string> {
  const course = await findCourse(courseInfo.identificator);

  if (course === null) {
    throw new Error("Course was not found");
  }

  const session = await findSession(courseInfo.session, course.id);
  if (session === null) {
    throw new Error("Session was not found");
  }

  return formEnrollPayload(course.id, session.id, students);
}

export { formEnrollPayload, formEnrollPayloadFromCourse };
