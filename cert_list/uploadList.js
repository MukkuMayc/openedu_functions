import csv from "csv-parser";
import { json } from "express";
import fs from "fs";
import fetch from "node-fetch";
import { exit } from "process";

let arr = [];

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    // console.log(row);
    arr = arr.concat(row);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
    console.log("Loaded", arr.length, "users");
    massupload();
  });

async function massupload() {
  console.log("called");
  for (const item in arr) {
    console.log("Upload certificate for", item);
    await fetch("http://localhost:8080/certificate", {
      method: "post",
      body: JSON.stringify({
        email: item.Email,
        session: "spring_2017",
        grade: item.MarkValue,
        certificateURL: item.QR,
      }),
    })
      .then((res) => console.log(res) || res.text())
      .then((res) => console.log(res));
    //   .then((res) => res.json())
    //   .then((json) => console.log(json))
    //   .catch((err) => console.log(err) || exit());
    exit();
  }
}
