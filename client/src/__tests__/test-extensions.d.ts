import { VueWrapper } from '@vue/test-utils' // eslint-disable-line

declare module '@vue/test-utils' {
  interface VueWrapper<VM, T> {
    byTestId(id: string): VueWrapper<VM, T>;
  }
}
