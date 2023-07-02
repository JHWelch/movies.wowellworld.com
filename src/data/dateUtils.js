export default class DateUtils {
  static today() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return DateUtils.dateToString(today);
  }

  static getThursdayDate() {
    const today = new Date();

    const thursday = today.getDay() < 5
      ? new Date(today.setDate(today.getDate() - today.getDay() + 4))
      : new Date(today.setDate(today.getDate() + 11 - today.getDay()));

    thursday.setHours(0, 0, 0, 0);

    return thursday;
  }

  static getThursday() {
    return DateUtils.dateToString(this.getThursdayDate());
  }

  static getNextTwoThursdays() {
    const thursday = this.getThursdayDate();

    return [
      this.dateToString(new Date(thursday.setDate(thursday.getDate() + 7))),
      this.dateToString(new Date(thursday.setDate(thursday.getDate() + 7))),
    ];
  }

  static dateToString(date) {
    return date.toISOString().substring(0, 10);
  }
}
