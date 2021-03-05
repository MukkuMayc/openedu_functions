interface CourseInfo {
  identificator: string;
  session: string;
}

interface Fullname {
  name: string | undefined;
  surname: string | undefined;
  secondname: string | undefined;
}

export { CourseInfo, Fullname };
