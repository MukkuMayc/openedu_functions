import fetch from "node-fetch";
import RequestFormPayload from "../RequestFormPayload.js";
import { defaultHeaders } from "../Config.js";

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
  let res = await fetch(
    `https://openedu.ru/autocomplete/course/?q=${course.tag}&$forward={"university":"${university}"}`,
    {
      headers: {
        ...defaultHeaders,
        referer: "https://openedu.ru/upd/spbu/student/massunenroll/",
      },
      method: "GET",
    }
  ).then((res) => res.json());

  const courseId = res.results[0].id;

  res = await fetch(
    `https://openedu.ru/autocomplete/session/active?forward={"course":"${courseId}","university":"${university}"}`,
    {
      headers: {
        ...defaultHeaders,
        referer: "https://openedu.ru/upd/spbu/student/massunenroll/",
      },
      method: "GET",
    }
  ).then((res) => res.json());

  const session = res.results.find((el) => el.text.includes(course.session)).id;
  const reason = "Why not";

  return formUnenrollPayload(courseId, session, reason, students, university);
}

export { formUnenrollPayload, formUnenrollPayloadFromCourse };
