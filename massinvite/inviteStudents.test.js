import inviteStudents from "./inviteStudents.js";

test("Invite VgTjuhPi;GXbJskHnAf@Osuu.ru;CmKHzu;tQfNvF;;;", (done) => {
  inviteStudents("VgTjuhPi;GXbJskHnAf@Osuu.ru;CmKHzu;tQfNvF;;;")
    .then((res) => {
      expect(res).toBe(200);
      done();
    })
    .catch((err) => done(err));
});
