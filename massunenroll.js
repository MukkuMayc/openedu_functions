const fetch = require("node-fetch");
const RequestPayload = require("./RequestPayload.js");

function formUnenrollPayload(course, session, reason, students, university) {
  let a = new RequestPayload();

  a.addField("course", course);
  a.addField("session", session);
  a.addField("reason", reason);
  a.addField("students", students, true);
  a.addField("university", university);
  a.addField("skip_group_check", 1, false, true);

  return a.toString();
}

const defaultRequestParams = {
  credentials: "include",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0",
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "en,en-US;q=0.8,ru-RU;q=0.5,ru;q=0.3",
    "X-Requested-With": "XMLHttpRequest",
    Cookie:
      "csrftoken=XlsFCc5Ah49Ov04O3W0WGkM4SF7aSTMfpgsJKZLWQG0QkNg9SAxL50ZygqmJxTAh; sessionid=zbvhcoy214uumag7fu9zpv2alybl0kfm; authenticated=1; authenticated_user=fortyways",
    referer: "https://openedu.ru/upd/spbu/student/massenroll/",
  },
  method: "GET",
  mode: "cors",
};

async function formUnenrollPayloadFromCourse(courseTag, sessionTag, students) {
  const university = 6;
  let res = await fetch(
    `https://openedu.ru/autocomplete/course/?q=${courseTag}&$forward={"university":"6"}`,
    defaultRequestParams
  ).then((res) => res.json());

  const course = res.results[0].id;

  res = await fetch(
    `https://openedu.ru/autocomplete/session/active?forward={"course":"${course}","university":"6"}`,
    defaultRequestParams
  ).then((res) => res.json());

  const session = res.results.find((el) => el.text.includes(sessionTag)).id;
  const reason = "Why not";

  return formUnenrollPayload(course, session, reason, students, university);
}

const opts = {
  method: "POST",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en,en-US;q=0.8,ru-RU;q=0.5,ru;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type":
      "multipart/form-data; boundary=---------------------------myform",
    "Upgrade-Insecure-Requests": "1",
    Cookie:
      "csrftoken=XlsFCc5Ah49Ov04O3W0WGkM4SF7aSTMfpgsJKZLWQG0QkNg9SAxL50ZygqmJxTAh; sessionid=zbvhcoy214uumag7fu9zpv2alybl0kfm; authenticated=1; authenticated_user=fortyways",
    referer: "https://openedu.ru/upd/spbu/student/massinvite/",
  },
};

const courses = [
  ["bzdh", "fall_2020_spbu_spec"],
  ["buis_mast", "fall_2020_spbu_spec"],
  ["histrus", "fall_2020_spbu_spec"],
  ["busart", "fall_2020_spbu_spec"],
  ["del_obs", "fall_2020_spbu_spec"],
  ["edu_tech", "fall_2020_spbu_spec"],
  ["pedpsyedu", "fall_2020_spbu_spec"],
  ["exp_rep", "fall_2020_spbu_spec"],
  ["edu_problms", "fall_2020_spbu_spec"],
  ["irthr", "fall_2020_spbu_spec"],
  ["busin_manag", "fall_2020_spbu_spec"],
  ["phylosophy", "fall_2020_spbu_spec"],
  ["entec", "fall_2020_spbu_spec"],
  ["effective_comm", "fall_2020_spbu_spec"],
  ["effect_commun", "fall_2020_spbu_spec"],
  ["effect_comm", "fall_2020_spbu_spec"],
];

(async () => {
  for (let i = 0; i < courses.length; ++i) {
    const res = await formUnenrollPayloadFromCourse(
      courses[i][0],
      courses[i][1],
      "st040291@student.spbu.ru"
    ).then((payload) => {
      return fetch("https://openedu.ru/upd/spbu/student/massunenroll/", {
        ...opts,
        body: payload,
      }).then((res) => res.json());
    });
    if (res.status === 0) {
      console.log("Successfully enrolled in", courses[i][0], courses[i][1]);
    } else {
      console.log(status, "Some error happened");
    }
  }
})();
