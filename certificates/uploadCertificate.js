import request from "../request.js";
import RequestFormPayload from "../RequestFormPayload.js";
import findCourse from "../common/findCourse.js";
import listSessionsPage from "../common/listSessionsPage.js";

function queryStudentId(query, session) {
  return request("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    // for some emails, it won't find student
    body: `search[value]=${query}&search[regex]=false&session=${session}`,
    additionalHeaders: {
      referer: "https://openedu.ru/upd/spbu/students/certificates",
      "X-CSRFToken":
        "CfzgIcQGCza2uwIjqbh4iMgXDMqiYiAuBjvMS6g2ehaIKF52zrJ8ImVVTXbamw2i",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
}

async function getStudentId(email, fullName, session) {
  const handleQueryResult = (email, res) => {
    if (!(res.data.length > 0)) {
      return null;
    }
    if (res.data.length === 1) return res.data[0][5];
    return res.data.find((el) => el[1] === email)[5];
  };

  let id = await queryStudentId(email, session)
    .then((res) => res.json())
    .then((json) => handleQueryResult(email, json));
  if (id) return id;

  id =
    id ||
    (await queryStudentId(
      `${fullName.name} ${fullName.surname} ${fullName.second_name}`,
      session
    )
      .then((res) => res.json())
      .then((json) => handleQueryResult(email, json)));

  id = id || (await getStudentIdBF(email, session));

  if (!id) throw Error("Student was not found");
  return id;
}

function requestStudents(session, start = 0) {
  return request("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    additionalHeaders: {
      referer: "https://openedu.ru/upd/spbu/students/certificates",
      "X-CSRFToken":
        "CfzgIcQGCza2uwIjqbh4iMgXDMqiYiAuBjvMS6g2ehaIKF52zrJ8ImVVTXbamw2i",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `start=${start}&length=100&session=${session}`,
  }).then((res) => res.json());
}

async function getStudentIdBF(email, session) {
  let st = null;
  let students = await requestStudents(session);
  const total = students.recordsTotal;
  students = students.data;
  st = students.find((st) => st[1] === email);
  if (!st) {
    for (let i = 100; i < total; i += 100) {
      students = (await requestStudents(session, i)).data;
      st = students.find((st) => st[1] === email);
      if (st) break;
    }
  }
  return st && st[5];
}

// Important! The courseName parameter have to match the following regexp:
// /\d{4}-\d{3}-\d{3} (.*) \(\d{2}.\d{2}.\d{4} - \d{2}.\d{2}.\d{4}\)/
async function uploadCertificate(email, fullName, grade, certUrl, courseName) {
  const [_, courseNormalName, ...courseDates] = courseName.match(
    /\d{4}-\d{3}-\d{3} (.*) \((\d{2}.\d{2}.\d{4}) - (\d{2}.\d{2}.\d{4})\)/
  );
  let course = await findCourse(courseNormalName);
  if (!course) throw Error(`Course "${courseNormalName}" was not found`);

  const courseId = course.id;
  let studentId;
  let page = 0;
  let morePages = false;
  do {
    let sessions = await listSessionsPage(courseId, ++page).then((res) => {
      morePages = res.pagination.more;
      return res.results;
    });
    let sessionWithSameDate = sessions.find((session) =>
      courseDates.find((d) => d === session.text.match(/\d{2}.\d{2}.\d{4}/g)[0])
    );

    if (sessionWithSameDate) {
      try {
        studentId = await getStudentId(email, fullName, sessionWithSameDate.id);
        console.log(
          `Found student ${email} at "${courseNormalName}", "${sessionWithSameDate.text}"`
        );
        break;
      } catch (err) {
        if (err.toString() !== "Error: Student was not found") throw err;
      }
    }

    sessionWithSameDate &&
      sessions.splice(
        sessions.findIndex((el) => el.id === sessionWithSameDate.id),
        1
      );

    for (const session of sessions) {
      try {
        studentId = await getStudentId(email, fullName, session.id);
        console.log(`Found student ${email} at ${session.text}`);
        break;
      } catch (err) {
        if (err.toString() !== "Error: Student was not found") throw err;
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
