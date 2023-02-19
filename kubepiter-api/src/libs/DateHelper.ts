export default class DateHelper {
  static getCurrentUnixTimestamp() {
    return Math.floor(Date.now() / 1000);
  }
}
