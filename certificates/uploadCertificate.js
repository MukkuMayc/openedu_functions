import request from "../request.js";
import RequestFormPayload from "../RequestFormPayload.js";

async function getStudentId(email, session) {
  return await request("https://openedu.ru/upd/spbu/students/certificates/", {
    method: "post",
    body: `search[value]=${email}&search[regex]=false&session=${session}`,
    additionalHeaders: {
      referer: "https://openedu.ru/upd/spbu/students/certificates",
      "X-CSRFToken":
        "CfzgIcQGCza2uwIjqbh4iMgXDMqiYiAuBjvMS6g2ehaIKF52zrJ8ImVVTXbamw2i",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then((json) => json.data[0][5]);
}

async function uploadCertificate(email, session, grade, certificateUrl) {
  const payload = new RequestFormPayload();

  const id = await getStudentId(email, session);
  payload.addField("participant_id", id);
  payload.addField("grade", grade);
  payload.addField("cert_type", "url");
  payload.addField("certificate_url", certificateUrl, false, true);

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
