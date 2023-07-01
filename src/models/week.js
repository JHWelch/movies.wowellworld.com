export default class Week {
  constructor(id, theme, date, isSkipped = false) {
    this.id = id;
    this.theme = theme;
    this.date = date;
    this.isSkipped = isSkipped;
  }

  static fromNotion(record) {
    return new Week(
      record.id,
      record.properties.Theme.title[0].plain_text,
      new Date(record.properties.Date.date.start),
      record.properties.Skipped.checkbox,
    );
  }

  static fromObject(obj) {
    return new Week(
      obj.id,
      obj.theme,
      new Date(obj.date),
      obj.isSkipped,
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

  setMovies(movies) {
    this.movies = movies;

    return this;
  }

  toString() {
    return `${this.theme}`;
  }

  toDTO() {
    return {
      id: this.id,
      theme: this.theme,
      date: this.displayDate(),
      movies: this.movies.map((movie) => movie.toDTO()),
      isSkipped: this.isSkipped,
    };
  }
}
