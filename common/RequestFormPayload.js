const ln = "\r\n";
/**
 * Class for request form(multipart/form-data) payload
 */
class RequestFormPayload {
  constructor(props) {
    props = props || {};
    const { token, boundary } = props;
    this.boundary = boundary || "-----------------------------myform";
    this.token =
      token ||
      process.env.CSRF_MIDDLEWARE_TOKEN ||
      console.log("Warning: csrfmiddlewaretoken not found!");
    this.payload = "";
    this.addField("csrfmiddlewaretoken", this.token);
  }

  addField(name, value, isCSV = false, isLast) {
    this.payload = this.payload.concat(this.boundary, ln);
    this.payload = this.payload.concat(
      `Content-Disposition: form-data; name=\"${name}\"${
        isCSV ? '; filename="somefile.csv"' : ""
      }${ln}`
    );
    if (isCSV) {
      this.payload = this.payload.concat(`Content-Type: text/csv${ln}`);
    }
    this.payload = this.payload.concat(`${ln}${value}${ln}`);
    if (isLast) {
      this.payload = this.payload.concat(this.boundary, ln);
    }
  }

  toString() {
    return this.payload;
  }
}

export default RequestFormPayload;
