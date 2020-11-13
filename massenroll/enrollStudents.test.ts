import enrollStudents from "./enrollStudents";

test("Enroll student hoYNcpSVka@CFuJ.ru in buis_mast course, fall_2020_spbu_spec session", () => {
  return expect(
    enrollStudents(
      { identificator: "buis_mast", session: "fall_2020_spbu_spec" },
      "hoYNcpSVka@CFuJ.ru"
    )
  ).resolves.toStrictEqual({
    redirect: "/upd/spbu/students/enrolled/",
    status: 0,
  });
});

test("Enroll student in nonexistent course", () => {
  return expect(
    enrollStudents(
      { identificator: "nonexistent_course", session: "fall_2020_spbu_spec" },
      "hoYNcpSVka@CFuJ.ru"
    )
  ).rejects.toThrow("Course was not found");
});
