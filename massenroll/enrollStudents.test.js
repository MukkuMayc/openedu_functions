import enrollStudents from "./enrollStudents.js";

test("Enroll student hoYNcpSVka@CFuJ.ru in buis_mast course, fall_2020_spbu_spec session", (done) => {
  enrollStudents(
    { tag: "buis_mast", session: "fall_2020_spbu_spec" },
    "hoYNcpSVka@CFuJ.ru"
  )
    .then((res) => {
      expect(res.status).toBe(0);
      done();
    })
    .catch((err) => done(err));
});

test("Enroll student in nonexistent course", async () => {
  await enrollStudents(
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
