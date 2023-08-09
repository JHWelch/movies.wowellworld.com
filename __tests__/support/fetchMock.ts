import { jest } from '@jest/globals'

export type MockFetch = jest.Mock<(input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>>

export function mockFetch(): MockFetch {
  const mockFetch = jest.fn<(input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>>()
  global.fetch = mockFetch

  return mockFetch
}
