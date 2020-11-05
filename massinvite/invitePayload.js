import RequestFormPayload from "../common/RequestFormPayload.js";
/**
 * Form payload for invite request
 * @param   {string} students CSV file with students. Required columns: username; email; last_name; first_name. Optional: second_name; student_id; group.
 * @returns {string}          Payload for invite request
 */
function formInvitePayload(students) {
  let payload = new RequestFormPayload();
  payload.addField("csv", students, true, true);
  return payload.toString();
}

export default formInvitePayload;
