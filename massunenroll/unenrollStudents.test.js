import unenrollStudents from "./unenrollStudents.js";

test("Unenroll student hoYNcpSVka@CFuJ.ru in buis_mast course, fall_2020_spbu_spec session", (done) => {
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
