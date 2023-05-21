export default class DateUtils {
  static getThursdayDate() {
    const today = new Date();
    const thursday = new Date(today.setDate(today.getDate() - today.getDay() + 4));

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
