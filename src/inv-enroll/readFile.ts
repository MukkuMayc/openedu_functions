import fs from "fs";
import csv from "csv-parser";

interface Student {
  Email: string;
  Name: string;
  Surname: string;
  SecondName: string;
  CourseName: string;
  Session: string;
}

async function readFile(path: string): Promise<Student[]> {
  let students: Student[] = [];
  await new Promise<void>((resolve) =>
    fs
      .createReadStream(path)
      .pipe(
        csv({
          separator: ";",
          headers: [
            "Email",
            "Surname",
            "Name",
            "SecondName",
            "CourseName",
            "Session",
          ],
        })
      )
      .on("data", (row) => {
        students.push(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        console.log("Loaded", students.length, "students");
        resolve();
      })
  );
  console.log(students);

  return students;
}

export { Student };
export default readFile;
