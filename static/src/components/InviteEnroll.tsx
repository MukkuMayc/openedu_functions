import * as React from "react";
import { Formik, Form, Field } from "formik";
import "./InviteEnroll.css";
import ButtonWithLoading from "./ButtonWithLoading";

async function sendForm(values: any) {
  let data = new FormData();
  data.append("file", values.file);
  return await fetch("/api/combine/inv-enroll", {
    method: "post",
    body: data,
  }).then((res) => res.text());
}

const InviteEnroll = () => (
  <div className="invite-enroll container d-flex justify-content-center">
    <div className="send-list-form-wrapper card flex-fill">
      <div className="card-body">
        <div className="card-title">
          <h3>Attach file with students</h3>
        </div>
        <div className="card-text">
          <Formik
            initialValues={{ file: "" }}
            validate={(values) => {
              const errors: { file?: string } = {};
              if (!values.file) {
                errors.file = "Required";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              sendForm(values).then((res) => {
                setSubmitting(false);
                alert(res);
              });
            }}
          >
            {({ isSubmitting, setFieldValue, errors }) => (
              <Form className="invite-enroll-form">
                <div className="form-group">
                  <label htmlFor="form-file">Students list</label>
                  <Field
                    id="form-file"
                    type="file"
                    className="form-control-file"
                    name="something"
                    onChange={(event: { currentTarget: { files: any[] } }) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                    }}
                  />
                  <small className="text-danger">{errors.file}</small>
                </div>
                <ButtonWithLoading
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Send
                </ButtonWithLoading>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  </div>
);

export default InviteEnroll;
