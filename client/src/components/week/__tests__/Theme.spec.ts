/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Theme from '@components/week/Theme.vue'
import { WeekDto } from '@shared/dtos'
import RichTextFactory from '@tests/utils/factories/richTextFactory'
import WeekFactory from '@tests/utils/factories/weekFactory'

let week: WeekDto

describe('Just a theme, no styled theme', () => {
  beforeEach(() => {
    week = new WeekFactory().build({
      theme: 'The Matrix',
    })
  })

  it('shows the theme', () => {
    const wrapper = mount(Theme, {
      props: {
        week: week,
      },
    })
    expect(wrapper.text()).toContain(week.theme)
  })
})

describe('Styled theme', () => {
  beforeEach(() => {
    week = new WeekFactory().build({
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
      props: { week },
    })

    const component = wrapper.find('[data-testid="theme"]')
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

describe('Week skipped', () => {
  beforeEach(() => {
    week = new WeekFactory().build({
      theme: 'The Matrix',
      isSkipped: true,
    })
  })

  it('shows the theme', () => {
    const wrapper = mount(Theme, {
      props: {
        week: week,
      },
    })
    expect(wrapper.text()).toContain('No movies this week!')
  })

  describe('with styled Theme', () => {
    beforeEach(() => {
      week.styledTheme = [
        new RichTextFactory().text('The').bold().build(),
        new RichTextFactory().text('Matrix').italic().build(),
      ]
    })

    it('shows the styled theme', () => {
      const wrapper = mount(Theme, {
        props: { week },
      })

      const component = wrapper.find('[data-testid="theme"]')
      expect(component.exists()).toBe(true)
      expect(component.element.children[0].innerHTML).toBe('The')
      expect(component.element.children[0].classList).toContain('font-bold')
      expect(component.element.children[1].innerHTML).toBe('Matrix')
      expect(component.element.children[1].classList).toContain('italic')
    })
  })
})
