import { reactive } from 'vue'
import { WeekDto } from '../../../shared/dtos'

export const rsvpModal = reactive<{
  show: boolean
  week?: WeekDto
  open: (week?: WeekDto) => void
  close: () => void
    }>({
      show: false,
      week: undefined,
      open: (week?: WeekDto) => {
        rsvpModal.show = true
        rsvpModal.week = week
      },
      close: () => rsvpModal.show = false,
    })
