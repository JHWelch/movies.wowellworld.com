export class Week {
  constructor(id, theme, date) {
    this.id = id;
    this.theme = theme;
    this.date = date;
  }

  static fromNotion(record) {
    return new Week(
      record.id,
      record.properties['Theme'].title[0].plain_text,
      new Date(record.properties['Date'].date.start),
    );
  }

  static fromObject(obj) {
    return new Week(
      obj.id,
      obj.theme,
      new Date(obj.date),
    );
  }

  displayDate() {
    return this.date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }

  setMovies(movie1, movie2) {
    this.movie1 = movie1;
    this.movie2 = movie2;

    return this;
  }

  toString() {
    return `${this.theme}`;
  }
}
