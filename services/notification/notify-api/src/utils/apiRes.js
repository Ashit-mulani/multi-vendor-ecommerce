class apiRes {
  constructor(status, message = "Success") {
    this.status = status;
    this.message = message;
    this.Success = status < 400;
  }
}

export { apiRes };
