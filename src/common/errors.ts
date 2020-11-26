enum ErrorType {
  NOT_AUTHENTICATED = "User is not authenticated",
  AUTHENTICATION_FAILED = "Fail to authenticate",
  NO_TASK_ID = "There is no task id",
  STUDENT_NOT_FOUND = "Student was not found",
}

class DefaultError extends Error {
  code: ErrorType;
  constructor(code: ErrorType) {
    super(code);
    this.code = code;
    this.name = "DefaultError";
  }
}

export { ErrorType, DefaultError };
