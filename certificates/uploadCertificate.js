import request from "../request.js";
import RequestFormPayload from "../RequestFormPayload.js";
import findCourse from "../common/findCourse.js";
import listSessionsPage from "../common/listSessionsPage.js";

async function getStudentId(email, fullName, session) {
  return await request("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    // for some emails, it won't find student
    body: `search[value]=${email}&search[regex]=false&session=${session}`,
    additionalHeaders: {
      referer: "https://openedu.ru/upd/spbu/students/certificates",
      "X-CSRFToken":
        "BvfD72qHE2xgHppmNbBTGwA1mSyKLSuGylASba5mSr4Q3pEMobX5KYnpo1ZBJp1e",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.data.length === 0) {
        // not found by email, trying to search by fullname
        return request("https://openedu.ru/upd/spbu/students/certificates/", {
          method: "post",
          body: `search[value]=${fullName.name} ${fullName.surname} ${fullName.second_name}&search[regex]=false&session=${session}`,
          additionalHeaders: {
            referer: "https://openedu.ru/upd/spbu/students/certificates",
            "X-CSRFToken":
              "BvfD72qHE2xgHppmNbBTGwA1mSyKLSuGylASba5mSr4Q3pEMobX5KYnpo1ZBJp1e",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.data.length === 0) {
              throw Error("Student was not found");
            }
            if (json.data.length > 1) {
              console.warn("More than one student with same fullname");
              const st = json.data.find((el) => el[1] === email);
              if (!st) {
                throw Error("Student was not found");
              }
              return st[5];
            }

            return json.data[0][5];
          });
      }
      if (json.data.length > 1) {
        throw Error("More than one student with same email");
      }
      return json.data[0][5];
    });
}

// Important! The courseName parameter have to match the following regexp:
// /\d{4}-\d{3}-\d{3} (.*) \(\d{2}.\d{2}.\d{4} - \d{2}.\d{2}.\d{4}\)/
async function uploadCertificate(email, fullName, grade, certUrl, courseName) {
  const courseNormalName = courseName.match(
    /\d{4}-\d{3}-\d{3} (.*) \(\d{2}.\d{2}.\d{4} - \d{2}.\d{2}.\d{4}\)/
  )[1];
  const courseId = (await findCourse(courseNormalName)).id;
  const regDate = /\d{2}.\d{2}.\d{4}/g;
  const courseDates = courseName.match(regDate);
  let studentId;
  let page = 0;
  let morePages = false;
  do {
    let sessions = await listSessionsPage(courseId, ++page).then((res) => {
      morePages = res.pagination.more;
      return res.results;
    });
    let sessionWithSameDate = sessions.find((session) =>
      courseDates.find((date) => date === session.text.match(regDate)[0])
    );

    if (sessionWithSameDate) {
      try {
        studentId = await getStudentId(email, fullName, sessionWithSameDate.id);
        console.log(`Found student ${email} at ${sessionWithSameDate.text}`);
      } catch (err) {
        console.log(err);
      }
    }

    if (studentId) break;
    if (sessionWithSameDate) {
      console.warn(
        `Student ${email} was not found in session with same date, trying to bruteforce sessions`
      );
      sessions.splice(
        sessions.findIndex((el) => el.id === sessionWithSameDate.id),
        1
      );
    } else {
      console.warn(
        `Session with same date was not found, trying to bruteforce sessions`
      );
    }

    for (const session of sessions) {
      try {
        studentId = await getStudentId(email, fullName, session.id);
        console.log(`Found student ${email} at ${session.text}`);
        break;
      } catch (err) {
        continue;
      }
    }
  } while (!studentId && morePages);

  if (!studentId) {
    console.log(`Student ${email} was not found`);
    throw Error(`Student ${email} was not found`);
  }

  const payload = new RequestFormPayload();
  payload.addField("participant_id", studentId);
  payload.addField("grade", grade);
  payload.addField("cert_type", "url");
  payload.addField("certificate_url", certUrl, false, true);

  return await request(
    "https://openedu.ru/upd/spbu/students/certificates/data",
    {
      method: "post",
      additionalHeaders: {
        referer: "https://openedu.ru/upd/spbu/students/certificates",
        "X-CSRFToken":
          "CfzgIcQGCza2uwIjqbh4iMgXDMqiYiAuBjvMS6g2ehaIKF52zrJ8ImVVTXbamw2i",
        "Content-Type":
          "multipart/form-data; boundary=---------------------------myform",
      },
      body: payload.toString(),
    }
  ).then((res) => res.text());
}

export default uploadCertificate;

// if (true) {
//   let courseName = "Публичная дипломатия США";
//   findCourse(courseName).then((res) => console.log(res));
// }
