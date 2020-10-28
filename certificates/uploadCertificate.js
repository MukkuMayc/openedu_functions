import request from "../request.js";
import fetch from "node-fetch";
import { defaultHeaders } from "../Config.js";
import RequestFormPayload from "../RequestFormPayload.js";
import { json } from "express";
// columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=asc&start=0&length=10&search%5Bvalue%5D=ivlevalex%40inbox.ru&search%5Bregex%5D=false&session=306

const curheader = {
  ...defaultHeaders,
  referer: "https://openedu.ru/upd/spbu/students/certificates",
  "X-CSRFToken":
    "CfzgIcQGCza2uwIjqbh4iMgXDMqiYiAuBjvMS6g2ehaIKF52zrJ8ImVVTXbamw2i",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
};

async function getStudentId(email, session) {
  // return await request("https://openedu.ru/upd/spbu/students/certificates/", {
  //   method: "post",
  //   body: `search[value]=${email}&search[regex]=false&session=${session}`,
  // })
  //   .then((res) => {
  //     if (res.status !== 0) {
  //       return res;
  //     }
  //     return res.res.json();
  //   })
  //   .then((json) => {
  //     console.log(json);
  //     return {
  //       status: 0,
  //       id: json.data[0][5],
  //     };
  //   });
  return await fetch("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    headers: curheader,
    body: `search[value]=${email}&search[regex]=false&session=${session}`,
  })
    .then((res) => console.log(res) || res.json())
    .then((json) => {
      return {
        status: 0,
        id: json.data[0][5],
      };
    })
    .catch((err) => {
      return {
        status: 1,
        error: err,
      };
    });
}

const email = "ivlevalex@inbox.ru";
const session = 306;
const grade = 88;
const certificateUrl = "http://www.africau.edu/images/default/sample.pdf";

async function uploadCertificate(email, session, grade, certificateUrl) {
  const payload = new RequestFormPayload();

  const id = await getStudentId(email, session).then((res) => res.id);
  payload.addField("participant_id", id);
  payload.addField("grade", grade);
  payload.addField("cert_type", "url");
  payload.addField("certificate_url", certificateUrl, false, true);
  console.log(payload.toString());

  return await fetch("https://openedu.ru/upd/spbu/students/certificates/data", {
    method: "post",
    headers: {
      ...curheader,
      "Content-Type":
        "multipart/form-data; boundary=---------------------------myform",
    },
    body: payload.toString(),
  });
}

uploadCertificate(email, session, grade, certificateUrl).then((res) =>
  console.log(res)
);
