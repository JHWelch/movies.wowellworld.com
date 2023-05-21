import Week from '../models/week.js';
import fake from './fake.json' assert { type: 'json' };
import Movie from '../models/movie.js';

export default function renderFake(res) {
  const week = Week.fromObject(fake.week)
    .setMovies(
      Movie.fromObject(fake.week.movie1),
      Movie.fromObject(fake.week.movie2),
    );

  res.render('index', { week });
}
