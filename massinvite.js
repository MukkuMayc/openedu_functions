// import users from "users.json";
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const readline = require("readline");

let form = new FormData();
form.append("my-file", fs.createReadStream("./invite.csv"));

const formBody = () => {
  const rl = readline.createInterface({
    input: fs.createReadStream("./invite.csv"),
    output: process.stdout,
    console: false,
  });

  rl.on("line", function (line) {
    console.log("In file", line);
  });
};

// formBody();

const opts = {
  method: "POST",
  body:
    '-----------------------------mycsvfile\r\nContent-Disposition: form-data; name="csrfmiddlewaretoken"\r\n\r\nmtF1ZCNsyNC6AcQJoX7m1uKw236GCd2FOoF57ptO7pt8pZ24dBEbqaX0qOlfhdQH\r\n-----------------------------mycsvfile\r\nContent-Disposition: form-data; name="csv"; filename="invite.csv"\r\nContent-Type: text/csv\r\n\r\nst065732;st065732@student.spbu.ru;Боярницки;Владимир;;;\r\n-----------------------------mycsvfile\r\n',
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en,en-US;q=0.8,ru-RU;q=0.5,ru;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type":
      "multipart/form-data; boundary=---------------------------mycsvfile",
    "Upgrade-Insecure-Requests": "1",
    Cookie:
      "csrftoken=XlsFCc5Ah49Ov04O3W0WGkM4SF7aSTMfpgsJKZLWQG0QkNg9SAxL50ZygqmJxTAh; sessionid=zbvhcoy214uumag7fu9zpv2alybl0kfm; authenticated=1; authenticated_user=fortyways",
    referer: "https://openedu.ru/upd/spbu/student/massinvite/",
  },
};

fetch("https://openedu.ru/upd/spbu/student/massinvite/", opts).then((res) =>
  console.log(res.status)
);
