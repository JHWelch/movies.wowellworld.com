/** @vitest-environment jsdom */

import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import SectionTitle from '@components/SectionTitle.vue'
import nowPlayingImg from '@assets/now_playing.png'

it('shows the passed image with alt text', () => {
  const wrapper = mount(SectionTitle, {
    props: {
      sectionTitle: {
        title: 'Now Playing',
        image: nowPlayingImg,
      },
    },
  })

  expect(wrapper.find('[alt="Now Playing"]').exists()).toBe(true)
  expect(wrapper.find('[src="' + nowPlayingImg + '"]'))
})
