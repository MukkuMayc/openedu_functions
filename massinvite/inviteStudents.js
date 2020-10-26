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
  })
    .then((res) => {
      let task_id = new RegExp("#[0-9]+").exec(
        parseString(res.headers.raw()["set-cookie"])[0]?.value
      );
      return task_id
        ? {
            status: 0,
            message: parseString(res.headers.raw()["set-cookie"])[0]?.value,
          }
        : { status: 1, message: "Something goes wrong, there is no task id" };
    })
    .catch((err) => {
      console.error("error", err);
      return { status: 2, message: "Some error happened", error: err };
    });
}

export default inviteStudents;
