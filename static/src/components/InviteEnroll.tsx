import * as React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

async function sendForm(values: any) {
  let data = new FormData();
  data.append("file", values.file);
  fetch("/api/combine/inv-enroll", {
    method: "post",
    body: data,
  })
    .then((res) => res.text())
    .then((text) => alert(text));
}

const InviteEnroll = () => (
  <Formik
    initialValues={{ file: null }}
    validate={(values) => {
      const errors: { file?: string } = {};
      if (!values.file) {
        errors.file = "Required";
      }
      return errors;
    }}
    onSubmit={(values, { setSubmitting }) => {
      setSubmitting(true);
      sendForm(values).then(() => {
        setSubmitting(false);
      });
    }}
  >
    {({ isSubmitting, setFieldValue }) => (
      <Form>
        <Field
          type="file"
          className="form-control-file"
          name="fileeeee"
          onChange={(event: { currentTarget: { files: any[] } }) => {
            setFieldValue("file", event.currentTarget.files[0]);
          }}
        />
        <ErrorMessage name="email" component="div" />
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </Form>
    )}
  </Formik>
);

export default InviteEnroll;
