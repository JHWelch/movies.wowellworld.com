/** @vitest-environment jsdom */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RsvpModal from '@components/RsvpModal.vue'
import WeekFactory from '@tests/utils/factories/weekFactory'
import { rsvpModal } from '@client/state/modalState'

describe('nothing input', () => {
  it('disables the submit button', () => {
    const week = new WeekFactory().build()
    rsvpModal.open(week)
    const wrapper = mount(RsvpModal)

    expect(wrapper.find('[data-testid="rsvp-button"]').attributes('disabled')).toBe('')
  })
})

describe('only name input', () => {
  it('enables the submit button', async () => {
    const week = new WeekFactory().build()
    rsvpModal.open(week)
    const wrapper = mount(RsvpModal)

    await wrapper.find('[data-testid="input-name"]').setValue('John Doe')

    expect(wrapper.find('[data-testid="rsvp-button"]').attributes('disabled')).toBe(undefined)
  })
})
