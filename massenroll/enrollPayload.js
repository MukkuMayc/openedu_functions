import fetch from "node-fetch";
import RequestFormPayload from "../RequestFormPayload.js";
import { defaultHeaders } from "../Config.js";
import parseString from "set-cookie-parser";

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

function request(
  url,
  referer = "https://openedu.ru/upd/spbu/student/massenroll/",
  method = "GET"
) {
  return fetch(url, {
    headers: {
      ...defaultHeaders,
      referer,
    },
    method,
  })
    .then((res) => {
      const authenticated = parseString(res.headers.raw()["set-cookie"])?.find(
        (el) => el.name === "authenticated"
      )?.value;
      let out = {};
      if (authenticated === 0 || authenticated === "0") {
        out.status = 1;
        out.message = "User is not authenticated";
        return out;
      }
      if (res.status !== 200) {
        out.status = 2;
        out.message = `Request didn't succeed, status code is ${res.status}`;
        return out;
      }
      out.status = 0;
      out.message = "OK";
      out.res = res;
      return out;
    })
    .catch((err) => {
      out.status = 3;
      out.message = "Some error happened";
      out.error = err;
    });
}

async function formEnrollPayloadFromCourse(course, students) {
  const university = 6;
  let res = await request(
    `https://openedu.ru/autocomplete/course/?q=${course.tag}&forward={"university":"${university}"}`
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
    `https://openedu.ru/autocomplete/session/active?forward={"course":"${courseId}","university":"${university}"}`
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
