import * as React from "react";
import { Formik, Form, Field } from "formik";
import ErrorMessage from "./ErrorMessage";
import "./Authenticate.css";

async function authenticate(username: string, password: string) {
  const res = await fetch("/api/authenticate", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return await res.text();
}
const Authenticate = () => (
  <div className="authenticate container d-flex justify-content-center">
    <div className="login-form-wrapper card flex-fill">
      <div className="card-body">
        <div className="card-title">
          <h3>Sign in to Openedu account</h3>
        </div>
        <div className="card-text">
          <Formik
            initialValues={{ username: "", password: "" }}
            validate={(values) =>
              values.username ? {} : { username: "Required" }
            }
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              authenticate(values.username, values.password).then((res) => {
                alert(res);
                setSubmitting(false);
              });
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form className="authenticate-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Field
                    id="username"
                    type="text"
                    name="username"
                    className="form-control"
                  />
                  <ErrorMessage message={errors.username} />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    id="password"
                    type="password"
                    name="password"
                    className="form-control"
                  />
                  <ErrorMessage message={errors.password} />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Sign in
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  </div>
);
export default Authenticate;
