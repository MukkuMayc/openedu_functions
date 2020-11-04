import request from "../request.js";

async function findCourse(title, university = 6) {
  if (!title) throw Error("Title is empty");
  let course = null;
  let res = null;
  let page = 0;
  do {
    res = await request(
      `https://openedu.ru/autocomplete/course/?page=${++page}&q=${encodeURI(
        title
      )}&forward={"university":"${university}"}`,
      {
        additionalHeaders: {
          referer: "https://openedu.ru/upd/spbu/student/massenroll/",
        },
      }
    ).then((res) => res.json());

    course = res.results.find(
      (el) => el.text.match(/\w+\/\w+ - (.+)/)[1] === title
    );
  } while (!course && res?.pagination.more);
  return course;
}

export default findCourse;
