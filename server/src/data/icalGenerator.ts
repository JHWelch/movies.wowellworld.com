
import { Week } from '@server/models/week'
import * as ics from 'ics'

export const icalGenerator = (week: Week): string | undefined => {
  const { error, value } = ics.createEvent({
    uid: week.dateString + '@movies.wowellworld.com',
    start: week.date.getTime(),
    duration: { minutes: week.totalLength },
    title: week.theme,
    description: 'Come one, come all (okay maybe not all) to the Welch-Cowell/Cowell-Welch/Wowell household for a recurring Thursday Night Movie Club!',
    location: '2111 W Argyle St. Chicago, IL 60625',
    url: 'https://movies.wowellworld.com/',
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: { name: 'Rachel & Jordan', email: 'fam@wowellworld.com' },
  })

  if (error) {
    console.error(error)

    return undefined
  }

  return value
}
