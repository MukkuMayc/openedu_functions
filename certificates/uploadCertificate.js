import request from "../request.js";
import RequestFormPayload from "../RequestFormPayload.js";

async function getStudentId(email, fullName, session) {
  return await request("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    // for some emails, it won't find student
    body: `search[value]=${email}&search[regex]=false&session=${session}`,
    additionalHeaders: {
      referer: "https://openedu.ru/upd/spbu/students/certificates",
      "X-CSRFToken":
        "CfzgIcQGCza2uwIjqbh4iMgXDMqiYiAuBjvMS6g2ehaIKF52zrJ8ImVVTXbamw2i",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.data.length === 0) {
        // not found by email, trying to search by fullname
        return request("https://openedu.ru/upd/spbu/students/certificates/", {
          method: "post",
          body: `search[value]=${fullName.name} ${fullName.surname} ${fullName.second_name}&search[regex]=false&session=${session}`,
          additionalHeaders: {
            referer: "https://openedu.ru/upd/spbu/students/certificates",
            "X-CSRFToken":
              "CfzgIcQGCza2uwIjqbh4iMgXDMqiYiAuBjvMS6g2ehaIKF52zrJ8ImVVTXbamw2i",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.data.length === 0) {
              throw Error("Student was not found");
            }
            if (json.data.length > 1) {
              console.warn("More than one student with same fullname");
              const st = json.data.find((el) => el[1] === email);
              if (!st) {
                throw Error("Student was not found");
              }
              return st[5];
            }

            return json.data[0][5];
          });
      }
      if (json.data.length > 1) {
        throw Error("More than one student with same email");
      }
      return json.data[0][5];
    });
}

function getSessions(page = 1) {
  return request(
    `https://openedu.ru/autocomplete/session/strict?page=${page}&forward={"course":"169","university":"6","brief":true}`,
    {
      additionalHeaders: {
        "X-CSRFToken":
          "CfzgIcQGCza2uwIjqbh4iMgXDMqiYiAuBjvMS6g2ehaIKF52zrJ8ImVVTXbamw2i",

        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        referer: "https://openedu.ru/upd/spbu/students/certificates",
      },
    }
  ).then((res) => res.json());
}

async function uploadCertificate(email, fullName, grade, certUrl) {
  const payload = new RequestFormPayload();

  let id;
  for (let page = 1; page < 100; ++page) {
    let sessions = await getSessions(page);
    for (const session of sessions.results) {
      try {
        id = await getStudentId(email, fullName, session.id);
        console.log(`Found student ${email} at ${session.text}`);
        break;
      } catch (err) {
        continue;
      }
    }
    if (id || !sessions?.pagination?.more) {
      break;
    }
  }

  if (!id) {
    console.log(`Student ${email} was not found`);
    throw Error("Student was not found");
  }

  payload.addField("participant_id", id);
  payload.addField("grade", grade);
  payload.addField("cert_type", "url");
  payload.addField("certificate_url", certUrl, false, true);

  return await request(
    "https://openedu.ru/upd/spbu/students/certificates/data",
    {
      method: "post",
      additionalHeaders: {
        referer: "https://openedu.ru/upd/spbu/students/certificates",
        "X-CSRFToken":
          "CfzgIcQGCza2uwIjqbh4iMgXDMqiYiAuBjvMS6g2ehaIKF52zrJ8ImVVTXbamw2i",
        "Content-Type":
          "multipart/form-data; boundary=---------------------------myform",
      },
      body: payload.toString(),
    }
  ).then((res) => res.text());
}

export default uploadCertificate;
