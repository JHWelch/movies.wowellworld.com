
import { Event } from '@server/models/event'
import * as ics from 'ics'
import ejs from 'ejs'
import directoryPath from '@server/helpers/directoryPath'

const description = (event: Event): string => 'Come one, come all (okay maybe not all) to the Welch-Cowell/Cowell-Welch/Wowell household for a recurring Thursday Night Movie Club!'
  + '\n\n'
  + 'This week\'s theme is ' + event.theme + '.'
  + '\n\n'
  + event.movies
    .map(movie => `${movie.time} - ${movie.title} (${movie.year})`)
    .join('\n')

const htmlDescription = async (event: Event) => (await ejs.renderFile(
  directoryPath() + '/../../views/event.html.ejs',
  event,
)).replace(/\s/g, ' ')

export const icalGenerator =
  async (event: Event): Promise<string | undefined> => {
    const { error, value } = ics.createEvent({
      uid: event.dateString + '@movies.wowellworld.com',
      start: event.startTime.toJSDate().getTime(),
      duration: { minutes: event.totalLength },
      title: 'Movie Nights: ' + event.theme,
      description: description(event),
      location: '2111 W Argyle St. Chicago, IL 60625',
      url: 'https://movies.wowellworld.com/',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: {
        name: 'Rachel & Jordan',
        email: 'fam@wowellworld.com',
      },
      htmlContent: '<p>' + await htmlDescription(event) + '</p>',
    })

    if (error) {
      console.error(error)

      return undefined
    }

    return value
  }
