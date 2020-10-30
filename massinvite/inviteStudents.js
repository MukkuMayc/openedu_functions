import fetch from "node-fetch";
import { defaultHeaders } from "../Config.js";
import formInvitePayload from "./invitePayload.js";
import parseString from "set-cookie-parser";

async function inviteStudents(students) {
  return await fetch("https://openedu.ru/upd/spbu/student/massinvite/", {
    headers: {
      ...defaultHeaders,
      "Content-Type":
        "multipart/form-data; boundary=---------------------------myform",
      referer: "https://openedu.ru/upd/spbu/student/massinvite/",
    },
    redirect: "manual",
    method: "POST",
    body: formInvitePayload(students),
  }).then((res) => {
    let task_id = new RegExp("#[0-9]+").exec(
      parseString(res.headers.raw()["set-cookie"])[0]?.value
    );
    if (task_id) {
      return parseString(res.headers.raw()["set-cookie"])[0]?.value;
    } else {
      throw new Error("There is no task id");
    }
  });
}

export default inviteStudents;
