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
    "https://openedu.ru/upd/spbu/student/massenroll/"
  ).then(async (res) => {
    if (res.status === 0) {
      res.results = (await res.res.json()).results;
    }
    return res;
  });

  if (res.status !== 0) {
    return res;
  }

  if (!(res?.results?.length > 0)) {
    return {
      status: 1,
      message: "Course was not found",
    };
  }

  const courseId = res.results[0].id;

  res = await request(
    `https://openedu.ru/autocomplete/session/active?forward={"course":"${courseId}","university":"${university}"}`,
    "https://openedu.ru/upd/spbu/student/massenroll/"
  ).then(async (res) => {
    if (res.status === 0) {
      res.results = (await res.res.json()).results;
    }
    return res;
  });

  if (res.status !== 0) {
    return res;
  }

  const session = res.results.find((el) => el.text.includes(course.session))
    ?.id;
  if (!session) {
    return {
      status: 2,
      message: "Session was not found",
    };
  }

  const enrollType = 13196;

  res = {
    status: 0,
    message: "OK",
    payload: formEnrollPayload(
      courseId,
      session,
      enrollType,
      students,
      university
    ),
  };

  return res;
}

export { formEnrollPayload, formEnrollPayloadFromCourse };
