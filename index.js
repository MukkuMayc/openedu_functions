import express from "express";
import inviteStudents from "./massinvite/inviteStudents.js";
import cors from "cors";
import bodyParser from "body-parser";
import enrollStudents from "./massenroll/enrollStudents.js";
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
    "/invitestudents\n" +
    "Example:\n" +
    'fetch("hostname/invitestudents", {\n' +
    'method: "POST"\n' +
    "  body: {\n" +
    '    students: "user1;mail1@ma.ru;Name;LastName;;;\\r\\nuser2;mail2@MumX.ru;Name;LastName;;;\\r\\n"' +
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
