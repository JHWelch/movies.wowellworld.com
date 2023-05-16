export class Movie {
  constructor (id, title, year) {
    this.id = id;
    this.title = title;
    this.year = year;
  }

  static fromNotion (movie) {
    console.log(movie);

    return new Movie(
      movie.id,
      movie.properties['Title'].title[0].plain_text,
      movie.properties['Year'].number
    );
  }

  toString() {
    return `${this.title} (${this.year})`;
  }
}
