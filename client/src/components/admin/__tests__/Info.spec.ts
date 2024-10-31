/** @vitest-environment jsdom */

import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Info from '@components/admin/Info.vue'

it('shows the input', () => {
  const wrapper = mount(Info, {
    props: {
      title: 'Title',
      value: 'Value',
    },
  })

  expect(wrapper.text()).toContain('Title')
  expect(wrapper.text()).toContain('Value')
})

it('defaults to small style', () => {
  const wrapper = mount(Info, {
    props: {
      title: 'Title',
      value: 'Value',
    },
  })

  expect(wrapper.find('.text-6xl').exists()).toBe(true)
  expect(wrapper.find('.col-span-2').exists()).toBe(false)
})

it('can specify small style', () => {
  const wrapper = mount(Info, {
    props: {
      title: 'Title',
      value: 'Value',
      style: 'small',
    },
  })

  expect(wrapper.find('.text-6xl').exists()).toBe(true)
  expect(wrapper.find('.col-span-2').exists()).toBe(false)
})

it('can be large', () => {
  const wrapper = mount(Info, {
    props: {
      title: 'Title',
      value: 'Value',
      style: 'large',
    },
  })

  expect(wrapper.find('.text-6xl').exists()).toBe(false)
  expect(wrapper.find('.col-span-2').exists()).toBe(true)
})
