import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

export const configureDayjs = (): void => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
}
