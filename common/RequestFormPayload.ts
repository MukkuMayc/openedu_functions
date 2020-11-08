const ln = "\r\n";
/**
 * Class for request form (multipart/form-data) payload
 */
class RequestFormPayload {
  boundary: string;
  token: string;
  payload: string;

  constructor(props?: { token?: string; boundary?: string; }) {
    props = props || {};
    const { token, boundary } = props;
    this.boundary = boundary || "-----------------------------myform";
    this.token =
      token ||
      process.env.CSRF_MIDDLEWARE_TOKEN ||
      console.log("Warning: csrfmiddlewaretoken not found!") || "";
    this.payload = "";
    this.addField("csrfmiddlewaretoken", this.token);
  }

  addField(name: string, value: string | { toString: () => string }, isCSV = false, isLast = false) {
    this.payload = this.payload.concat(this.boundary, ln);
    this.payload = this.payload.concat(
      `Content-Disposition: form-data; name=\"${name}\"${isCSV ? '; filename="somefile.csv"' : ""
      }${ln}`
    );
    if (isCSV) {
      this.payload = this.payload.concat(`Content-Type: text/csv${ln}`);
    }
    this.payload = this.payload.concat(`${ln}${value.toString()}${ln}`);
    if (isLast) {
      this.payload = this.payload.concat(this.boundary, ln);
    }
  }

  toString() {
    return this.payload;
  }
}

export default RequestFormPayload;
