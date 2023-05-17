export class Movie {
  constructor (id, title, year, length, imdbUrl, posterUrl) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.length = length;
    this.imdbUrl = imdbUrl;
    this.posterUrl = posterUrl;
  }

  static fromNotion (movie) {
    console.log(movie.properties);

    return new Movie(
      movie.id,
      movie.properties['Title']?.title[0]?.plain_text,
      movie.properties['Year']?.number,
      movie.properties['Length (mins)']?.number,
      movie.properties['IMDb']?.url,
      movie.properties['Poster']?.url,
    );
  }

  displayLength () {
    return `${Math.floor(this.length / 60)}h ${this.length % 60}m`;
  }

  toString() {
    return `${this.title} (${this.year})`;
  }
}
