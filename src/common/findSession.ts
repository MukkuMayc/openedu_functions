import listSessionsPage from "./listSessionsPage";

/**
 * Find session by query
 * @param query      Part of tag(spbu/DTBS/fall_2020, DTBS/fall_2020 or fall_2020) or date(10.09.2020)
 * @param courseId   Id of the course
 * @param university University code, SPbU is 6
 * @returns id - session id, text - full title with tag and date
 */
async function findSession(
  query: string,
  courseId: number,
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
    res = await listSessionsPage(courseId, ++page, university);

    course =
      res.results.find((el) => {
        let match = el.text.match(
          /(\w+\/((\w+)\/(\w+))) \((\d{2}.\d{2}.\d{4})\)/
        );
        return match?.some((el) => el.toLowerCase() === query);
      }) || null;
  } while (!course && res?.pagination.more);
  return course && { text: course.text, id: parseInt(course.id) };
}

export default findSession;
