import request from "../common/request.js";
import RequestFormPayload from "../common/RequestFormPayload.js";
import findCourse from "../common/findCourse.js";
import listSessionsPage from "../common/listSessionsPage.js";

/**
 * Query student whose parameters contain query as substring;
 * @param   {string} substr  Email or name of student
 * @param   {number} session Session number code
 * @returns {}
 */
function queryStudentId(substr, session) {
  return request("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    // for some emails, it won't find student
    body: `search[value]=${substr}&search[regex]=false&session=${session}`,
    headers: {
      referer: "https://openedu.ru/upd/spbu/students/certificates",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
}

/**
 * Make different requests to find student's id
 * @param   {string}               email    Student's email
 * @param   {{
              name: string;
              surname: string;
              second_name: string;
            }}                     fullName Full name of student
 * @param   {number}               session  Session's number code
 * @returns {Promise<number>}               Student's id
 */
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

/**
 * Request list of students
 * @param   {number}         session Session's number code
 * @param   {number}         start   Student's number from that we start
 * @returns {{
 *  data: string[][];
 *  recordsTotal: number;
 *  recordsFiltered: number;
 * }}                                data: list of students, recordsTotal: how many students in session, recordsFiltered: in that context is the same as recordsTotal.
 */
function requestStudents(session, start = 0) {
  return request("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    headers: {
      referer: "https://openedu.ru/upd/spbu/students/certificates",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `start=${start}&length=100&session=${session}`,
  }).then((res) => res.json());
}

/**
 * Brute force all students to find one with same email and returns id
 * @param   {number}          email   Student's email
 * @param   {number}          session Session's number code
 * @returns {Promise<number>}         Student's id
 */
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

/**
 * Upload certificate for student
 * @param  {string}     email      email
 * @param {{
 * name: string;
 * surname: string;
 * second_name: string;
 * }}                   fullName   Full name of student
 * @param  {number}     grade      Student's grade
 * @param  {string}     certUrl    Certificate's url
 * @param  {string}     courseName Name of course. \
 *                                 Important! The courseName parameter have to match the following regexp:
 *                                 `/\d{4}-\d{3}-\d{3} (.*) \(\d{2}.\d{2}.\d{4} - \d{2}.\d{2}.\d{4}\)/`
 * @returns {Promise<string>}      "Success!" in case of success and Error in another
 */
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
      headers: {
        referer: "https://openedu.ru/upd/spbu/students/certificates",
        "Content-Type":
          "multipart/form-data; boundary=---------------------------myform",
      },
      body: payload.toString(),
    }
  ).then((res) => res.text());
}

export default uploadCertificate;
