import formInvitePayload from "./invitePayload.js";
import parseString from "set-cookie-parser";
import request from "../request.js";

async function inviteStudents(students) {
  return await request("https://openedu.ru/upd/spbu/student/massinvite/", {
    headers: {
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
