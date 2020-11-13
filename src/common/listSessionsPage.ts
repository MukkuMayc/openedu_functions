import request from "./request";

/**
 * List course sessions page by page
 * @returns `results` - sessions list, every session contains id and text name;\
 *          `pagination.more` - true, if there are more pages after this page.
 */
async function listSessionsPage(courseId: number, page: number = 1): Promise<{
  results: { id: string; text: string; }[];
  pagination: { more: boolean; };
}> {
  const res = await request(
    `https://openedu.ru/autocomplete/session/strict?page=${page}&forward={"course":"${courseId}","university":"6","brief":true}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        referer: "https://openedu.ru/upd/spbu/students/certificates",
      },
    }
  );
  return await res.json();
}

export default listSessionsPage;
