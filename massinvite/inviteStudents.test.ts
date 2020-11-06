import inviteStudents from "./inviteStudents";

test("Invite VgTjuhPi;GXbJskHnAf@Osuu.ru;CmKHzu;tQfNvF;;;", () => {
  return expect(
    inviteStudents("VgTjuhPi;GXbJskHnAf@Osuu.ru;CmKHzu;tQfNvF;;;")
  ).resolves.toBeDefined();
});
