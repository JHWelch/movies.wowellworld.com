/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Assertion, AsymmetricMatchersContaining } from 'vitest'
import type { CallHistoryFilter, UserRouteConfig } from 'fetch-mock'

interface CustomMatchers<R = unknown> {
  toHaveFetched: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveLastFetched: (
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R
  toHaveNthFetched: (
    n: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R
  toHaveFetchedTimes: (
    times: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R

  toBeDone: (routes: RouteName | RouteName[]) => R

  toHaveGot: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveLastGot: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveNthGot: (
    n: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R
  toHaveGotTimes: (
    times: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R

  toHavePosted: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveLastPosted: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveNthPosted: (
    n: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R
  toHavePostedTimes: (
    times: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R

  toHavePut: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveLastPut: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveNthPut: (
    n: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R
  toHavePutTimes: (
    times: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R

  toHaveDeleted: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveLastDeleted: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveNthDeleted: (
    n: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R
  toHaveDeletedTimes: (
    times: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R

  toHaveFetchedHead: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveLastFetchedHead: (
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R
  toHaveNthFetchedHead: (
    n: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R
  toHaveFetchedHeadTimes: (
    times: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R

  toHavePatched: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveLastPatched: (filter?: CallHistoryFilter, options?: UserRouteConfig) => R
  toHaveNthPatched: (
    n: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R
  toHavePatchedTimes: (
    times: number,
    filter?: CallHistoryFilter,
    options?: UserRouteConfig,
  ) => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
