import csv from "csv-parser";
import fs from "fs";
import fetch from "node-fetch";

interface CSVField {
  Email: string;
  Name: string;
  Surname: string;
  SecondName: string;
  MarkValue: string;
  QR: string;
  CourseFullName: string;
}

let arr: CSVField[] = [];

fs.createReadStream("03_11_cert.csv")
  .pipe(csv())
  .on("data", (row) => {
    arr.push(row);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
    console.log("Loaded", arr.length, "users");
    massupload(arr);
  });

async function massupload(arr: CSVField[]) {
  for (const item of arr) {
    console.log("Upload certificate for", item.Email);
    console.log(
      await fetch("http://localhost:8080/certificate", {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          email: item.Email,
          fullName: {
            name: item.Name,
            surname: item.Surname,
            secondName: item.SecondName,
          },
          grade: parseInt(item.MarkValue),
          certificateUrl: item.QR,
          courseName: item.CourseFullName,
        }),
      }).then((res) => {
        if (res.status === 200) {
          return res
            .json()
            .then((json) =>
              JSON.parse(json).status === 0 ? "Success!\n" : "Error\n"
            );
        } else {
          return res.text().then((text) => text + "\n");
        }
      })
    );
  }
}
