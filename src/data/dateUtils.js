export default class DateUtils {
  static today() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return DateUtils.dateToString(today);
  }

  static dateToString(date) {
    return date.toISOString().substring(0, 10);
  }
}
