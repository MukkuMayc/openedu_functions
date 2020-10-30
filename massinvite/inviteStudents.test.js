import inviteStudents from "./inviteStudents.js";

test("Invite VgTjuhPi;GXbJskHnAf@Osuu.ru;CmKHzu;tQfNvF;;;", () => {
  return expect(
    inviteStudents("VgTjuhPi;GXbJskHnAf@Osuu.ru;CmKHzu;tQfNvF;;;")
  ).resolves.toBeDefined();
});
