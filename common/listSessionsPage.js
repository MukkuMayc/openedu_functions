import request from "../request.js";

function listSessionsPage(courseId, page = 1) {
  return request(
    `https://openedu.ru/autocomplete/session/strict?page=${page}&forward={"course":"${courseId}","university":"6","brief":true}`,
    {
      additionalHeaders: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        referer: "https://openedu.ru/upd/spbu/students/certificates",
      },
    }
  ).then((res) => res.json());
}

export default listSessionsPage;
