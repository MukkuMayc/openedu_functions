import request from "../common/request.js";
import RequestFormPayload from "../common/RequestFormPayload.js";
import findCourse from "../common/findCourse.js";
import getStudentId from "./getStudentId.js";

/**
 * Upload certificate for student
 * @param  {string}     email      Email
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

  const studentId = await getStudentId(
    email,
    fullName,
    courseId,
    courseNormalName,
    courseDates
  );

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
