import request from "./request";

/**
 * List courses page by page
 * @returns `results` - courses list, every course contains id and text name;\
 *          `pagination.more` - true, if there are more pages after this page.
 */
async function listCoursesPage(
  query: string,
  page = 1,
  university = 6
): Promise<{
  results: { id: string; text: string }[];
  pagination: { more: boolean };
}> {
  const res = await request(
    `https://openedu.ru/autocomplete/course/?page=${page}&q=${encodeURI(
      query
    )}&forward={"university":"${university}"}`,
    {
      headers: {
        referer: "https://openedu.ru/upd/spbu/student/massenroll/",
      },
    }
  );
  return await res.json();
}

export default listCoursesPage;
