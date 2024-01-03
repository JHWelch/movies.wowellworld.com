import { reactive } from 'vue'
import { WeekDto } from '../../../shared/dtos'

type RsvpModalState = {
  show: boolean
  week?: WeekDto
  open: (week?: WeekDto) => void
  close: () => void
}

export const rsvpModal: RsvpModalState = reactive<RsvpModalState>({
  show: false,
  week: undefined,
  open: (week?: WeekDto) => {
    rsvpModal.show = true
    rsvpModal.week = week
  },
  close: () => (rsvpModal.show = false),
})
