import listCoursesPage from "./listCoursesPage";

/**
 * Find course by query
 * @param query      Course title(Базы данных) or tag(spbu/ACADRU)
 * @param university University code, SPbU is 6
 * @returns id - course id, text - full title with tag
 */
async function findCourse(
  query: string,
  university = 6
): Promise<{
  id: number;
  text: string;
} | null> {
  if (!query) throw Error("Title is empty");
  query = query.toLowerCase();
  let course: { id: string; text: string } | null;
  let res: {
    results: { id: string; text: string }[];
    pagination: { more: boolean };
  };
  let page = 0;
  do {
    res = await listCoursesPage(query, ++page, university);

    course =
      res.results.find((el) => {
        let match = el.text.match(/(\w+\/(\w+)) - (.+)/);
        return match?.some((el) => el.toLowerCase() === query);
      }) || null;
  } while (!course && res?.pagination.more);
  return course && { text: course.text, id: parseInt(course.id) };
}

export default findCourse;
