import request from "../common/request";
import RequestFormPayload from "../common/RequestFormPayload";
import findCourse from "../common/findCourse";
import getStudentId from "./getStudentId";

/**
 * Upload certificate for student
 * @param email      Email
 * @param fullName   Full name of student
 * @param grade      Student's grade
 * @param certUrl    Certificate's url
 * @param courseName Name of course \
 *                   Important! The courseName parameter have to match the following regexp:
 *                   `/\d{4}-\d{3}-\d{3} (.*) \(\d{2}.\d{2}.\d{4} - \d{2}.\d{2}.\d{4}\)/`
 * @returns "Success!" in case of success and Error in another
 */
async function uploadCertificate(email: string, fullName: {
  name: string;
  surname: string;
  secondName: string;
}, grade: number, certUrl: string, courseName: string): Promise<string> {
  const [, courseNormalName, ...courseDates] = courseName.match(
    /\d{4}-\d{3}-\d{3} (.*) \((\d{2}.\d{2}.\d{4}) - (\d{2}.\d{2}.\d{4})\)/
  ) || ['', courseName];

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

  if (studentId === null) {
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
