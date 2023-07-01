export default class Movie {
  constructor(
    id,
    title,
    director,
    year,
    length,
    imdbUrl,
    posterUrl,
    theaterName = null,
    showingUrl = null,
  ) {
    this.id = id;
    this.title = title;
    this.director = director;
    this.year = year;
    this.length = length;
    this.imdbUrl = imdbUrl;
    this.posterUrl = posterUrl;
    this.theaterName = theaterName;
    this.showingUrl = showingUrl;
  }

  static fromNotion(movie) {
    return new Movie(
      movie.id,
      movie.properties.Title?.title[0]?.plain_text,
      movie.properties.Director?.rich_text[0]?.plain_text,
      movie.properties.Year?.number,
      movie.properties['Length (mins)']?.number,
      movie.properties.IMDb?.url,
      movie.properties.Poster?.url,
      movie.properties['Theater Name']?.rich_text[0]?.plain_text,
      movie.properties['Showing URL']?.url,
    );
  }

  static fromObject(obj) {
    return new Movie(
      obj.id,
      obj.title,
      obj.director,
      obj.year,
      obj.length,
      obj.imdbUrl,
      obj.posterUrl,
      obj.theaterName,
      obj.showingUrl,
    );
  }

  isFieldTrip() {
    return this.theaterName !== null && this.showingUrl !== null;
  }

  displayLength() {
    return `${Math.floor(this.length / 60)}h ${this.length % 60}m`;
  }

  toString() {
    return `${this.title} (${this.year})`;
  }

  toDTO() {
    return {
      id: this.id,
      title: this.title,
      director: this.director,
      year: this.year,
      length: this.length,
      imdbUrl: this.imdbUrl,
      posterUrl: this.posterUrl,
      theaterName: this.theaterName,
      showingUrl: this.showingUrl,
      isFieldTrip: this.isFieldTrip(),
      displayLength: this.displayLength(),
    };
  }
}
