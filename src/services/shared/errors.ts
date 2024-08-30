export class ErrorServiceUnauthenticated extends Error {
  constructor (service: string) {
    super(`${service}: "account.instance" is not defined, you need to authenticate first.`);
    this.name = "ErrorServiceUnauthenticated";
  }
}