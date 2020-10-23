import fetch from "node-fetch";
import { defaultHeaders } from "./Config.js";
import RequestFormPayload from "./RequestFormPayload.js";

function formInvitePayload(students) {
  let payload = new RequestFormPayload();
  payload.addField("csv", students, true, true);
  console.log(payload.toString());
  return payload.toString();
}

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
