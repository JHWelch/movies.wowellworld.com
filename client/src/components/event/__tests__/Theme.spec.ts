/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Theme from '@components/event/Theme.vue'
import { EventDto } from '@shared/dtos'
import RichTextFactory from '@tests/utils/factories/richTextFactory'
import EventFactory from '@tests/utils/factories/eventFactory'

let eventDto: EventDto

describe('Just a theme, no styled theme', () => {
  beforeEach(() => {
    eventDto = new EventFactory().build({
      theme: 'The Matrix',
    })
  })

  it('shows the theme', () => {
    const wrapper = mount(Theme, {
      props: { event: eventDto },
    })
    expect(wrapper.text()).toContain(eventDto.theme)
  })
})

describe('Styled theme', () => {
  beforeEach(() => {
    eventDto = new EventFactory().build({
      theme: 'The Matrix',
      styledTheme: [
        new RichTextFactory().text('The').bold().build(),
        new RichTextFactory().text('Matrix').italic().build(),
        new RichTextFactory().text('is').underline().build(),
        new RichTextFactory().text('the best').strikethrough().build(),
      ],
    })
  })

  it('shows the styled theme', () => {
    const wrapper = mount(Theme, {
      props: { event: eventDto },
    })

    const component = wrapper.byTestId('theme')
    expect(component.exists()).toBe(true)
    expect(component.element.children[0].innerHTML).toBe('The')
    expect(component.element.children[0].classList).toContain('font-bold')
    expect(component.element.children[1].innerHTML).toBe('Matrix')
    expect(component.element.children[1].classList).toContain('italic')
    expect(component.element.children[2].innerHTML).toBe('is')
    expect(component.element.children[2].classList).toContain('underline')
    expect(component.element.children[3].innerHTML).toBe('the best')
    expect(component.element.children[3].classList).toContain('line-through')
  })
})

describe('Event skipped', () => {
  beforeEach(() => {
    eventDto = new EventFactory().build({
      theme: 'The Matrix',
      isSkipped: true,
    })
  })

  it('shows the theme', () => {
    const wrapper = mount(Theme, {
      props: { event: eventDto },
    })
    expect(wrapper.text()).toContain('No movies this week!')
  })

  describe('with styled Theme', () => {
    beforeEach(() => {
      eventDto.styledTheme = [
        new RichTextFactory().text('The').bold().build(),
        new RichTextFactory().text('Matrix').italic().build(),
      ]
    })

    it('shows the styled theme', () => {
      const wrapper = mount(Theme, {
        props: { event: eventDto },
      })

      const component = wrapper.byTestId('theme')
      expect(component.exists()).toBe(true)
      expect(component.element.children[0].innerHTML).toBe('The')
      expect(component.element.children[0].classList).toContain('font-bold')
      expect(component.element.children[1].innerHTML).toBe('Matrix')
      expect(component.element.children[1].classList).toContain('italic')
    })
  })
})
