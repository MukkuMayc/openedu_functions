import RequestFormPayload from "../common/RequestFormPayload";
import findCourse from "../common/findCourse";
import findSession from "../common/findSession";

/**
 * Form payload for unenroll request
 * @param course   Course id
 * @param session  Session id
 * @param reason   Reason for unenrolling
 * @param students Students in CSV format
 * @param univer   University code, SPbU is 6
 * @returns Payload for unenroll request
 */
function formUnenrollPayload(
  course: number,
  session: number,
  students: string,
  reason = "Why not",
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
 * @param courseInfo Contains information about course: tag (example: phylosophy) and session (example: fall_2020_spbu_spec)
 * @param students   Students to unenroll in CSV format. Only required field: email
 * @returns Payload for unenroll request
 */
async function formUnenrollPayloadFromCourse(
  courseInfo: {
    tag: string;
    session: string;
  },
  students: string
): Promise<string> {
  const course = await findCourse(courseInfo.tag);

  if (course === null) {
    throw new Error("Course was not found");
  }

  const session = await findSession(courseInfo.session, course.id);
  if (session === null) {
    throw new Error("Session was not found");
  }

  return formUnenrollPayload(course.id, session.id, students);
}

export { formUnenrollPayload, formUnenrollPayloadFromCourse };
