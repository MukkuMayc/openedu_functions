import * as React from "react";
import { Formik, Form, Field } from "formik";
import ErrorMessage from "./ErrorMessage";
import "./InviteEnroll.css";
import ButtonWithLoading from "./ButtonWithLoading";

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
              sendForm(values).then(() => {
                setSubmitting(false);
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
                  <ErrorMessage message={errors.file} />
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
