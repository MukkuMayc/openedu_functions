import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as yup from "yup";
import fs from "fs";
import dotenv from "dotenv";
import multer from "multer";
import inviteStudents from "./massinvite/inviteStudents";
import enrollStudents from "./massenroll/enrollStudents";
import unenrollStudents from "./massunenroll/unenrollStudents";
import uploadCertificate from "./certificates/uploadCertificate";
import { askEmail, askPassword } from "./common/askCredentials";
import authenticate from "./authentication/authentificate";
import getMWToken from "./authentication/getMWToken";
import readFile, { Student } from "./inv-enroll/readFile";
import { CourseInfo } from "./common/types";

const result = dotenv.config();

if (result.error && !result.error.message.includes("ENOENT")) {
  throw result.error;
}

const upload = multer({ dest: "./upload" });

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

// app.get("/", (_req, res) => {
//   const resText =
//     "/invite\n" +
//     'fetch("hostname/invite", {\n' +
//     '  method: "POST"\n' +
//     "  headers: {\n" +
//     '    "Content-Type": "application/json; charset=UTF-8",\n' +
//     "  },\n" +
//     "  body: {\n" +
//     '    students: "user1;mail1@ma.ru;Name;LastName;;;\\nuser2;mail2@MumX.ru;Name;LastName;;;\n"' +
//     "  }\n" +
//     "})\n" +
//     "\n" +
//     "/enroll\n" +
//     'fetch("hostname/enroll", {\n' +
//     '  method: "POST"\n' +
//     "  headers: {\n" +
//     '    "Content-Type": "application/json; charset=UTF-8",\n' +
//     "  },\n" +
//     "  body: {\n" +
//     "    courseInfo: {\n" +
//     '      tag: "edu_tech",\n' +
//     '      session: "fall_2020_spbu_spec"\n' +
//     "    }\n" +
//     '    students: "user1;mail1@ma.ru;Name;LastName;;;\\nuser2;mail2@MumX.ru;Name;LastName;;;\n"' +
//     "  }\n" +
//     "})\n" +
//     "\n" +
//     "/unenroll\n" +
//     'fetch("hostname/unenroll", {\n' +
//     '  method: "POST"\n' +
//     "  headers: {\n" +
//     '    "Content-Type": "application/json; charset=UTF-8",\n' +
//     "  },\n" +
//     "  body: {\n" +
//     "    courseInfo: {\n" +
//     '      tag: "edu_tech",\n' +
//     '      session: "fall_2020_spbu_spec"\n' +
//     "    }\n" +
//     '    students: "user1;mail1@ma.ru;Name;LastName;;;\\nuser2;mail2@MumX.ru;Name;LastName;;;\n"' +
//     "  }\n" +
//     "})\n" +
//     "\n" +
//     "/certificate\n" +
//     'fetch("hostname/certificate", {\n' +
//     '  method: "POST"\n' +
//     "  headers: {\n" +
//     '    "Content-Type": "application/json; charset=UTF-8",\n' +
//     "  },\n" +
//     "  body: {\n" +
//     '    email: "me@example.com"\n' +
//     "    fullName: {\n" +
//     "      name: Name,\n" +
//     "      surname: Surname,\n" +
//     "      secondName: Second,\n" +
//     "    }\n" +
//     "    grade: 95\n" +
//     '    certificateUrl: "http://www.africau.edu/images/default/sample.pdf"\n' +
//     "    courseName: 2017-006-001 Базы данных (15.02.2017 - 20.05.2017)" +
//     "  }\n" +
//     "})\n";
//   res.send(resText);
// });

app.use(express.static("build/static"));

app.post("/invite", async (req, res) => {
  const yupBody = yup.object().shape({
    students: yup.string().required(),
  });

  yupBody
    .validate(req.body)
    .then(() =>
      inviteStudents(req.body.students)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(500).send(err.toString());
        })
    )
    .catch((err) => res.status(400).send(err.toString()));
});

app.post("/enroll", async (req, res) => {
  const yupBody = yup.object().shape({
    courseInfo: yup.object().shape({
      tag: yup.string().required(),
      session: yup.string().required(),
    }),
    students: yup.string().required(),
  });

  await yupBody
    .validate(req.body)
    .then(() =>
      enrollStudents(req.body.courseInfo, req.body.students)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(500).send(err.toString());
        })
    )
    .catch((err) => res.status(400).send(err.toString()));
});

app.post("/unenroll", async (req, res) => {
  const yupBody = yup.object().shape({
    courseInfo: yup.object().shape({
      tag: yup.string().required(),
      session: yup.string().required(),
    }),
    students: yup.string().required(),
  });

  await yupBody
    .validate(req.body)
    .then(() =>
      unenrollStudents(req.body.courseInfo, req.body.students)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(500).send(err.toString());
        })
    )
    .catch((err) => res.status(400).send(err.toString()));
});

app.post("/certificate", async (req, res) => {
  const yupBody = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    fullName: yup
      .object()
      .shape({
        name: yup.string().notRequired(),
        surname: yup.string().notRequired(),
        secondName: yup.string().notRequired(),
      })
      .required(),
    grade: yup.number().required(),
    certificateUrl: yup.string().url().required(),
    courseName: yup.string(),
  });

  await yupBody
    .validate(req.body)
    .then(() =>
      uploadCertificate(
        req.body.email,
        req.body.fullName,
        req.body.grade,
        req.body.certificateUrl,
        req.body.courseName
      )
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(500).send(err.toString());
        })
    )
    .catch((err) => res.status(400).send(err.toString()));
});

app.post("/combine/inv-enroll", upload.single("fileeeee"), async (req, res) => {
  const students = await readFile(req.file.path);

  const studentsSchema = yup.array().of(
    yup.object().shape({
      Email: yup.string().email().required(),
      Name: yup.string().required(),
      Surname: yup.string().required(),
      SecondName: yup.string().notRequired(),
      CourseName: yup.string().required(),
      Session: yup.string().required(),
    })
  );

  await new Promise((resolve) =>
    studentsSchema
      .validate(students)
      .then(() => resolve())
      .catch((err) => res.status(400).send(err.toString()))
  );

  const studentsInviteData = students.reduce((acc, i) => {
    const [, username] = i.Email.match(/(\w+)@/) || [, ""];
    return acc.concat(
      `${username};${i.Email};${i.Name};${i.Surname};${i.SecondName}\r\n`
    );
  }, "");
  console.log(studentsInviteData);

  let results = {
    invite: "",
    enroll: {
      status: 0,
      redirect: "",
    },
  };

  await inviteStudents(studentsInviteData).then((res) => {
    results.invite = res;
  });

  const studentsInCourses = students.reduce(
    (acc: Map<CourseInfo, Student[]>, item) => {
      const courseInfo = new CourseInfo(item.CourseName, item.Session);
      acc.get(courseInfo) || acc.set(courseInfo, []);
      acc.get(courseInfo)!.push(item);
      return acc;
    },
    new Map()
  );

  for (const course of studentsInCourses) {
    const emails = course[1].reduce(
      (acc, i) => acc.concat(`${i.Email}\r\n`),
      ""
    );
    const [, name] =
      course[0].identificator.match(
        /\d{4}-\d{3}-\d{3} (.*) \(\d{2}.\d{2}.\d{4} - \d{2}.\d{2}.\d{4}\)/
      ) || [];
    console.log({ identificator: name, session: course[0].session }, emails);
    await enrollStudents(
      { identificator: name, session: course[0].session },
      emails
    ).then((res) => {
      results.enroll = res;
    });
  }

  console.log(req.file, req.body);
  res.json(results);
});

const port = process.env.PORT || 8080;

async function authorize() {
  const res = await authenticate(await askEmail(), await askPassword());
  return res;
}

async function loadMWToken() {
  console.log("Loading CSRF middleware token");
  process.env.CSRF_MIDDLEWARE_TOKEN = await getMWToken();
}

function saveEnv() {
  return new Promise((resolve) =>
    fs.writeFile(
      ".env",
      `CSRF_TOKEN=${process.env.CSRF_TOKEN}
CSRF_MIDDLEWARE_TOKEN=${process.env.CSRF_MIDDLEWARE_TOKEN}
AUTHENTICATED_USER=${process.env.AUTHENTICATED_USER}
SESSION_ID=${process.env.SESSION_ID}`,
      resolve
    )
  );
}

if (
  !process.env.CSRF_TOKEN ||
  !process.env.SESSION_ID ||
  !process.env.AUTHENTICATED_USER
) {
  console.log("User is not authenticated");
  authorize().then((cookies) => {
    process.env.CSRF_TOKEN = cookies.get("csrftoken");
    process.env.AUTHENTICATED_USER = cookies.get("authenticated_user");
    process.env.SESSION_ID = cookies.get("sessionid");
    loadMWToken().then(() => {
      saveEnv().then(() => startApp());
    });
  });
} else {
  process.env.CSRF_MIDDLEWARE_TOKEN
    ? startApp()
    : loadMWToken()
        .then(() => saveEnv())
        .then(() => startApp());
}

function startApp() {
  app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
  });
}
