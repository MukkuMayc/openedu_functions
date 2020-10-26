import unenrollStudents from "./unenrollStudents.js";

test("Unenroll student hoYNcpSVka@CFuJ.ru from buis_mast course, fall_2020_spbu_spec session", (done) => {
  unenrollStudents(
    { tag: "buis_mast", session: "fall_2020_spbu_spec" },
    "hoYNcpSVka@CFuJ.ru"
  )
    .then((res) => {
      expect(res.status).toBe(0);
      done();
    })
    .catch((err) => done(err));
});

test("Unenroll student from nonexistent course", async () => {
  await unenrollStudents(
    { tag: "nonexistent_course", session: "fall_2020_spbu_spec" },
    "hoYNcpSVka@CFuJ.ru"
  )
    .then((res) => {
      console.log(res);
      expect(res.status).toBe(1);
      expect(res.message).toBe("Course was not found");
    })
    .catch((err) => console.error(err));
});
