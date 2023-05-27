export default class DateUtils {
  static getThursdayDate() {
    const today = new Date();

    const thursday = today.getDay() < 5
      ? new Date(today.setDate(today.getDate() - today.getDay() + 4))
      : new Date(today.setDate(today.getDate() + 11 - today.getDay()));

    thursday.setHours(0, 0, 0, 0);

    return thursday;
  }

  static getThursday() {
    return this.getThursdayDate().toISOString().substring(0, 10);
  }

  static getNextTwoThursdays() {
    const thursday = this.getThursdayDate();

    return [
      new Date(thursday.setDate(thursday.getDate() + 7)).toISOString().substring(0, 10),
      new Date(thursday.setDate(thursday.getDate() + 7)).toISOString().substring(0, 10),
    ];
  }
}
