class RequestFormPayload {
  constructor(props) {
    props = props || {};
    const { token, boundary } = props;
    this.boundary = boundary || "-----------------------------myform";
    this.token =
      token ||
      "SikIkbBTaVNX4GEgUsxeBysi8ZgEf0LEkdkMsYhfJxEZTtQBJ6430eFMwKvdU0zG";
    this.payload = "";
    this.addField("csrfmiddlewaretoken", this.token);
  }

  addField(name, value, isCSV = false, isLast) {
    this.payload = this.payload.concat(this.boundary, "\r\n");
    this.payload = this.payload.concat(
      `Content-Disposition: form-data; name=\"${name}\"${
        isCSV ? '; filename="somefile.csv"' : ""
      }\r\n`
    );
    if (isCSV) {
      this.payload = this.payload.concat("Content-Type: text/csv\r\n");
    }
    this.payload = this.payload.concat(`\r\n${value}\r\n`);
    if (isLast) {
      this.payload = this.payload.concat(this.boundary, "\r\n");
    }
  }

  toString() {
    return this.payload;
  }
}

export default RequestFormPayload;
