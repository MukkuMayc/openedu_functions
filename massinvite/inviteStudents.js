import fetch from "node-fetch";
import { defaultHeaders } from "../Config.js";
import formInvitePayload from "./invitePayload.js";

async function inviteStudents(students) {
  const res = await fetch("https://openedu.ru/upd/spbu/student/massinvite/", {
    headers: {
      ...defaultHeaders,
      "Content-Type":
        "multipart/form-data; boundary=---------------------------myform",
      referer: "https://openedu.ru/upd/spbu/student/massinvite/",
    },
    method: "POST",
    body: formInvitePayload(students),
  })
    .then((res) => res.status)
    .catch((err) => console.error("error", err));
  return res;
}

export default inviteStudents;