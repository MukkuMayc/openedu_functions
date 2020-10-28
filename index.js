import express from "express";
import inviteStudents from "./massinvite/inviteStudents.js";
import cors from "cors";
import bodyParser from "body-parser";
import enrollStudents from "./massenroll/enrollStudents.js";
import unenrollStudents from "./massunenroll/unenrollStudents.js";

import * as Yup from "yup";

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
    "      tag: edu_tech,\n" +
    "      session: fall_2020_spbu_spec\n" +
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
    "      tag: edu_tech,\n" +
    "      session: fall_2020_spbu_spec\n" +
    "    }\n" +
    '    students: "user1;mail1@ma.ru;Name;LastName;;;\\nuser2;mail2@MumX.ru;Name;LastName;;;\n"' +
    "  }\n" +
    "})\n";
  res.send(resText);
});

app.post("/invite", async (req, res) => {
  res.json(await inviteStudents(req.body?.students));
});

app.post("/enroll", async (req, res) => {
  res.json(await enrollStudents(req.body?.course, req.body?.students));
});

app.post("/unenroll", async (req, res) => {
  res.json(await unenrollStudents(req.body?.course, req.body?.students));
});

const port = 8080;

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
