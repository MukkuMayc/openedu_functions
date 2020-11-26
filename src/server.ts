import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as yup from "yup";
import dotenv from "dotenv";
import multer from "multer";
import inviteStudents from "./massinvite/inviteStudents";
import enrollStudents from "./massenroll/enrollStudents";
import unenrollStudents from "./massunenroll/unenrollStudents";
import uploadCertificate from "./certificates/uploadCertificate";
import authenticate from "./authentication/authentificate";
import getMWToken from "./authentication/getMWToken";
import readFile, { Student } from "./inv-enroll/readFile";
import saveEnv from "./common/saveEnv";
import isAuthenticated from "./authentication/isAuthenticated";

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

app.use(express.static("build/static"));

app.post("/api/invite", async (req, res) => {
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

app.post("/api/enroll", async (req, res) => {
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

app.post("/api/unenroll", async (req, res) => {
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

app.post("/api/certificate", async (req, res) => {
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

app.post("/api/combine/inv-enroll", upload.single("file"), async (req, res) => {
  console.log("file", req.file);
  if (!req.file) {
    res.status(400).send("You sent no file");
    return;
  }
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
      .then(() => resolve(0))
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
    (acc: Map<string, Student[]>, item) => {
      const courseInfo = `${item.CourseName}, ${item.Session}`;
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
      course[0].match(
        /\d{4}-\d{3}-\d{3} (.*) \(\d{2}.\d{2}.\d{4} - \d{2}.\d{2}.\d{4}\)/
      ) || [];
    console.log({ identificator: name, session: course[1][0].Session }, emails);
    await enrollStudents(
      { identificator: name, session: course[1][0].Session },
      emails
    ).then((res) => {
      results.enroll = res;
    });
  }

  console.log(req.file, req.body);
  res.json(results);
});

app.post("/api/authenticate", async (req, res) => {
  const yupBody = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });
  yupBody
    .validate(req.body)
    .then(async () => {
      const { username, password } = req.body;
      const cookies = await authenticate(username, password);
      process.env.CSRF_TOKEN = cookies.get("csrftoken");
      process.env.AUTHENTICATED_USER = cookies.get("authenticated_user");
      process.env.SESSION_ID = cookies.get("sessionid");
      process.env.CSRF_MIDDLEWARE_TOKEN = await getMWToken();
      await saveEnv();
      res.send("Authenticated");
    })
    .catch((err) => res.send(err.toString()));
});

app.get("/api/check-authentication", async (_req, res) => {
  const authenticated = await isAuthenticated();
  res.send(authenticated ? "Authenticated" : "Not authenticated");
});

const port = process.env.PORT || 8080;

if (
  !process.env.CSRF_TOKEN ||
  !process.env.SESSION_ID ||
  !process.env.AUTHENTICATED_USER ||
  !process.env.CSRF_MIDDLEWARE_TOKEN
) {
  console.log("User is not authenticated!");
}

function startApp() {
  app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
  });
}

startApp();
