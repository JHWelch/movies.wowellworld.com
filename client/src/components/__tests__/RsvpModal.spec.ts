/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RsvpModal from '@components/RsvpModal.vue'
import WeekFactory from '@tests/utils/factories/weekFactory'
import { rsvpModal } from '@client/state/modalState'
import { fireConfetti } from '@client/utilities/confetti'

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

describe('rsvp submit', () => {
  beforeEach(() => {
    fetch.doMock()
    vi.mock(import('@client/utilities/confetti'), () => ({
      fireConfetti: vi.fn(),
    }))
  })

  it('calls api with the correct data', async () => {
    fetch.mockResponseOnce(JSON.stringify({}))
    const week = new WeekFactory().build({
      weekId: '2020-01-01',
    })
    rsvpModal.open(week)
    const wrapper = mount(RsvpModal)
    await wrapper.find('[data-testid="input-name"]').setValue('John Doe')
    await wrapper.find('[data-testid="input-email"]').setValue('jdoe@example.com')

    await wrapper.find('[data-testid="rsvp-button"]').trigger('click')

    expect(fetch.requests().length).toEqual(1)
    const request = fetch.requests()[0]
    expect(request.method).toEqual('POST')
    expect(request.url).toEqual('/api/weeks/2020-01-01/rsvp')
    expect(JSON.parse(request.body)).toEqual({
      name: 'John Doe',
      email: 'jdoe@example.com',
      plusOne: false,
    })
  })

  it('closes the modal', async () => {
    fetch.mockResponseOnce(JSON.stringify({}))
    const week = new WeekFactory().build()
    rsvpModal.open(week)
    const wrapper = mount(RsvpModal)
    await wrapper.find('[data-testid="input-name"]').setValue('John Doe')

    await wrapper.find('[data-testid="rsvp-button"]').trigger('click')

    expect(rsvpModal.show).toBe(false)
  })

  it('fires confetti', async () => {
    fetch.mockResponseOnce(JSON.stringify({}))
    const week = new WeekFactory().build()
    rsvpModal.open(week)
    const wrapper = mount(RsvpModal)
    await wrapper.find('[data-testid="input-name"]').setValue('John Doe')

    await wrapper.find('[data-testid="rsvp-button"]').trigger('click')

    expect(fireConfetti).toHaveBeenCalled()
  })
})
