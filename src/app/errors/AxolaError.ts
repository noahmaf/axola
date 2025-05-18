class AxolaError extends Error {
  code: string;
  error?: Error;

  constructor(code: string, message: string, error?: Error) {
    super(message);
    this.name = "AxolaError";
    this.code = code;
    this.error = error;
    Object.setPrototypeOf(this, AxolaError.prototype);
  }
}

export default AxolaError;
