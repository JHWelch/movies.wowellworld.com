import { DOMWrapper } from '@vue/test-utils'
import 'vitest'

declare module '@vue/test-utils' {
  interface VueWrapper {
    byTestId(id: string): DOMWrapper<Element>
  }
}

interface CustomMatchers<R = unknown> {
  toBeValue: (value: string) => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {} // eslint-disable-line
  interface AsymmetricMatchersContaining extends CustomMatchers {} // eslint-disable-line
}
