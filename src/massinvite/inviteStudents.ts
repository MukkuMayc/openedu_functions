import formInvitePayload from "./invitePayload";
import parseString from "set-cookie-parser";
import request from "../common/request";

/**
 *  Make an invite request
 * @param students CSV file with students. Required columns: username; email; last_name; first_name. Optional: second_name; student_id; group.
 * @returns Message from server
 */
async function inviteStudents(students: string): Promise<string> {
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
    if (
      res.headers.raw().location &&
      res.headers.raw().location[0].includes("sso.openedu.ru/oauth2/authorize")
    ) {
      throw new Error("User is not authenticated");
    }
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
