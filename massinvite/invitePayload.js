import RequestFormPayload from "../common/RequestFormPayload.js";

function formInvitePayload(students) {
  let payload = new RequestFormPayload();
  payload.addField("csv", students, true, true);
  return payload.toString();
}

export default formInvitePayload;
