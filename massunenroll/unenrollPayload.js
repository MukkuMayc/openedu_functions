import RequestFormPayload from "../RequestFormPayload.js";
import request from "../request.js";

function formUnenrollPayload(course, session, reason, students, university) {
  let payload = new RequestFormPayload();
  payload.addField("course", course);
  payload.addField("session", session);
  payload.addField("reason", reason);
  payload.addField("students", students, true);
  payload.addField("university", university);
  payload.addField("skip_group_check", 1, false, true);
  return payload.toString();
}

async function formUnenrollPayloadFromCourse(course, students) {
  const university = 6;
  let res = await request(
    `https://openedu.ru/autocomplete/course/?q=${course.tag}&forward={"university":"${university}"}`,
    "https://openedu.ru/upd/spbu/student/massunenroll/"
  ).then(async (res) => {
    if (res.status === 0) {
      res.results = (await res.res.json()).results;
    }
    return res;
  });

  if (res.status !== 0) {
    return res;
  }

  const courseId = res.results[0].id;

  res = await request(
    `https://openedu.ru/autocomplete/session/active?forward={"course":"${courseId}","university":"${university}"}`,
    "https://openedu.ru/upd/spbu/student/massunenroll/"
  ).then(async (res) => {
    if (res.status === 0) {
      res.results = (await res.res.json()).results;
    }
    return res;
  });

  if (res.status !== 0) {
    return res;
  }

  const session = res.results.find((el) => el.text.includes(course.session)).id;
  const reason = "Why not";

  res = {
    status: 0,
    message: "OK",
    payload: formUnenrollPayload(
      courseId,
      session,
      reason,
      students,
      university
    ),
  };

  return res;
}

export { formUnenrollPayload, formUnenrollPayloadFromCourse };
