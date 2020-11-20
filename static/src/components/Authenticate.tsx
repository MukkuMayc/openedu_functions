import * as React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

async function authenticate(username: string, password: string) {
  const res = await fetch("/api/authenticate", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return await res.text();
}

const Authenticate = () => (
  <div>
    <h1>Authorize to Openedu</h1>
    <Formik
      initialValues={{ username: "", password: "" }}
      validate={(values) => (!values.username ? { username: "Required" } : {})}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        authenticate(values.username, values.password).then((res) => {
          alert(res);
          setSubmitting(false);
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Field type="text" name="username" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
);
export default Authenticate;
