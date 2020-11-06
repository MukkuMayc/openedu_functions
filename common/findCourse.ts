import request from "./request";

/**
 * Find course by title
 * @param title      Course title
 * @param university University code, SPbU is 6
 * @returns id - course id, text - title in another format
 */
async function findCourse(title: string, university = 6): Promise<{
  id: number;
  text: string;
}> {
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
        headers: {
          referer: "https://openedu.ru/upd/spbu/student/massenroll/",
        },
      }
    ).then((res) => res.json());

    course = res.results.find(
      (el: { id: number; text: string }) => {
        let match = el.text.match(/\w+\/\w+ - (.+)/);
        return match ? match[1] === title : false
      }
    );
  } while (!course && res?.pagination.more);
  course.id = parseInt(course.id);
  return course;
}

export default findCourse;
