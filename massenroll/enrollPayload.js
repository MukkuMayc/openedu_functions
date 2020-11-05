import RequestFormPayload from "../RequestFormPayload.js";
import request from "../request.js";

function formEnrollPayload(course, session, enrollType, students, university) {
  let payload = new RequestFormPayload();
  payload.addField("course", course);
  payload.addField("session", session);
  payload.addField("enrollment_type", enrollType);
  payload.addField("students", students, true);
  payload.addField("university", university);
  payload.addField("skip_group_check", 1, false, true);
  return payload.toString();
}

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
