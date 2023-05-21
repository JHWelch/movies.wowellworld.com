import Week from '../models/week.js';
import fake from './fake.json' assert { type: 'json' };
import Movie from '../models/movie.js';

function processWeek(week) {
  return Week.fromObject(week)
    .setMovies(
      Movie.fromObject(week.movie1),
      Movie.fromObject(week.movie2),
    );
}

export default function renderFake(res) {
  const currentWeek = processWeek(fake.week1);

  const upcoming = fake.upcoming.map(processWeek);

  res.render('index', { currentWeek, upcoming });
}
