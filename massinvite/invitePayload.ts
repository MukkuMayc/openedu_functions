import RequestFormPayload from "../common/RequestFormPayload";
/**
 * Form payload for invite request
 * @param   students CSV file with students. Required columns: username; email; last_name; first_name. Optional: second_name; student_id; group.
 * @returns Payload for invite request
 */
function formInvitePayload(students: string): string {
  let payload = new RequestFormPayload();
  payload.addField("csv", students, true, true);
  return payload.toString();
}

export default formInvitePayload;
