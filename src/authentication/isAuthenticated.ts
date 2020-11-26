import inviteStudents from "../massinvite/inviteStudents";

async function isAuthenticated() {
  const res = await inviteStudents("").catch((err: Error) => err);
  return !res.toString().includes("User is not authenticated");
}

export default isAuthenticated;
