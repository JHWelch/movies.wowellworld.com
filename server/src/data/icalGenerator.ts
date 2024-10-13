
import { Week } from '@server/models/week'
import * as ics from 'ics'
import ejs from 'ejs'
import directoryPath from '@server/helpers/directoryPath'

const description = (week: Week): string => 'Come one, come all (okay maybe not all) to the Welch-Cowell/Cowell-Welch/Wowell household for a recurring Thursday Night Movie Club!'
  + '\n\n'
  + 'This week\'s theme is ' + week.theme + '.'
  + '\n\n'
  + week.movies
    .map(movie => `${movie.time} - ${movie.title} (${movie.year})`)
    .join('\n')

const htmlDescription = async (week: Week) => (await ejs.renderFile(
  directoryPath() + '/../../views/event.html.ejs',
  week,
)).replace(/\s/g, ' ')

export const icalGenerator =
  async (week: Week): Promise<string | undefined> => {
    const { error, value } = ics.createEvent({
      uid: week.dateString + '@movies.wowellworld.com',
      start: week.startTime.toJSDate().getTime(),
      duration: { minutes: week.totalLength },
      title: 'Movie Nights: ' + week.theme,
      description: description(week),
      location: '2111 W Argyle St. Chicago, IL 60625',
      url: 'https://movies.wowellworld.com/',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: {
        name: 'Rachel & Jordan',
        email: 'fam@wowellworld.com',
      },
      htmlContent: '<p>' + await htmlDescription(week) + '</p>',
    })

    if (error) {
      console.error(error)

      return undefined
    }

    return value
  }
