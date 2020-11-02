import csv from "csv-parser";
import fs from "fs";
import fetch from "node-fetch";
import { exit } from "process";

let arr = [];

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    arr.push(row);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
    console.log("Loaded", arr.length, "users");
    massupload();
  });

async function massupload() {
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
          full_name: {
            name: item.Name,
            surname: item.Surname,
            second_name: item.SecondName,
          },
          session: 306,
          grade: parseInt(item.MarkValue),
          certificateURL: item.QR,
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
