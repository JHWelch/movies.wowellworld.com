import { Mock, vi } from 'vitest'

type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
) => Promise<Response>

export type MockFetch = Mock<FetchFunction>

export function mockFetch (): MockFetch {
  const mockFetch = vi.fn<FetchFunction>()
  global.fetch = mockFetch

  return mockFetch
}
