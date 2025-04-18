import { beforeEach, expect, it, jest } from '@jest/globals'
import { icalGenerator } from '@server/data/icalGenerator'
import _directoryPath from '@server/helpers/directoryPath'
import MovieFactory from '@tests/support/factories/movieFactory'
import EventFactory from '@tests/support/factories/eventFactory'
import MockDate from 'mockdate'

const directoryPath = _directoryPath as jest.Mock

beforeEach(() => {
  MockDate.set('2021-01-01')
  directoryPath.mockReturnValue(__dirname + '/../../src/data')
})

it('can generate an ical file from an event', async () => {
  const event = new EventFactory().make()
  event.movies = [
    new MovieFactory().make({
      title: 'Labyrinth',
      director: 'Jim Henson',
      year:1986,
      url: 'https://example.com/labyrinth',
      tmdbId: 1234,
      posterPath: '/path/to/labyrinth.jpg',
      notionId: 'notionId1',
      theaterName: 'Theater',
      showingUrl: 'https://cal.example.com/labyrinth',
      time: '6:00 PM',
      length: 105,
    }),
    new MovieFactory().make({
      title: 'The NeverEnding Story',
      director: 'Wolfgang Petersen',
      year: 1984,
      url: 'https://example.com/neverending-story',
      tmdbId: 1234,
      posterPath: '/path/to/neverending_story.jpg',
      notionId: 'notionId2',
      theaterName: 'Theater',
      showingUrl: 'https://cal.example.com/neverending-story',
      time: '8:00 PM',
    }),
  ]

  expect(await icalGenerator(event)).toMatchSnapshot()
})
