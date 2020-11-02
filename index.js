import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import inviteStudents from "./massinvite/inviteStudents.js";
import enrollStudents from "./massenroll/enrollStudents.js";
import unenrollStudents from "./massunenroll/unenrollStudents.js";
import uploadCertificate from "./certificates/uploadCertificate.js";
const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  const resText =
    "/invite\n" +
    'fetch("hostname/invite", {\n' +
    'method: "POST"\n' +
    "  body: {\n" +
    '    students: "user1;mail1@ma.ru;Name;LastName;;;\\nuser2;mail2@MumX.ru;Name;LastName;;;\n"' +
    "  }\n" +
    "})\n" +
    "\n" +
    "/enroll\n" +
    'fetch("hostname/enroll", {\n' +
    'method: "POST"\n' +
    "  body: {\n" +
    "    course: {\n" +
    '      tag: "edu_tech",\n' +
    '      session: "fall_2020_spbu_spec"\n' +
    "    }\n" +
    '    students: "user1;mail1@ma.ru;Name;LastName;;;\\nuser2;mail2@MumX.ru;Name;LastName;;;\n"' +
    "  }\n" +
    "})\n" +
    "\n" +
    "/unenroll\n" +
    'fetch("hostname/unenroll", {\n' +
    'method: "POST"\n' +
    "  body: {\n" +
    "    course: {\n" +
    '      tag: "edu_tech",\n' +
    '      session: "fall_2020_spbu_spec"\n' +
    "    }\n" +
    '    students: "user1;mail1@ma.ru;Name;LastName;;;\\nuser2;mail2@MumX.ru;Name;LastName;;;\n"' +
    "  }\n" +
    "})\n" +
    "\n" +
    "/certificate\n" +
    'fetch("hostname/certificate", {\n' +
    'method: "POST"\n' +
    "  body: {\n" +
    '    email: "me@example.com"\n' +
    '    session: "fall_2020_spbu_spec"\n' +
    "    grade: 95\n" +
    '    certificateURL: "http://www.africau.edu/images/default/sample.pdf"\n' +
    "  }\n" +
    "})\n";
  res.send(resText);
});

app.post("/invite", async (req, res) => {
  await inviteStudents(req.body?.students)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).send(err.toString());
    });
});

app.post("/enroll", async (req, res) => {
  await enrollStudents(req.body?.course, req.body?.students)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).send(err.toString());
    });
});

app.post("/unenroll", async (req, res) => {
  await unenrollStudents(req.body?.course, req.body?.students)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).send(err.toString());
    });
});

app.post("/certificate", async (req, res) => {
  const { email, full_name, grade, certificateURL, course_name } = req.body;
  await uploadCertificate(email, full_name, grade, certificateURL, course_name)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).send(err.toString());
    });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
