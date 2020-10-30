import unenrollStudents from "./unenrollStudents.js";

test("Unenroll student hoYNcpSVka@CFuJ.ru from buis_mast course, fall_2020_spbu_spec session", () => {
  return expect(
    unenrollStudents(
      { tag: "buis_mast", session: "fall_2020_spbu_spec" },
      "hoYNcpSVka@CFuJ.ru"
    )
  ).resolves.toStrictEqual({
    redirect: "/upd/spbu/students/enrolled/",
    status: 0,
  });
});

test("Unenroll student from nonexistent course", () => {
  return expect(
    unenrollStudents(
      { tag: "nonexistent_course", session: "fall_2020_spbu_spec" },
      "hoYNcpSVka@CFuJ.ru"
    )
  ).rejects.toThrow("Course was not found");
});
