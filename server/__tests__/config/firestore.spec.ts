import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import setupFirestore from '@server/config/firestore'
import { mockConfig } from '@tests/support/mockConfig'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setupFirestore', () => {
  it('initializes the firestore', () => {
    const firestore = setupFirestore(mockConfig())

    expect (applicationDefault).toHaveBeenCalledTimes(1)
    expect (initializeApp).toHaveBeenCalledTimes(1)
    expect (getFirestore).toHaveBeenCalledTimes(1)
    expect(firestore).toBeDefined()
  })

  it('connects to the firestore emulator in development', () => {
    const firestore = setupFirestore(mockConfig({ nodeEnv: 'development' }))

    expect(applicationDefault).toHaveBeenCalledTimes(1)
    expect(initializeApp).toHaveBeenCalledTimes(1)
    expect(getFirestore).toHaveBeenCalledTimes(1)
    expect(connectFirestoreEmulator).toHaveBeenCalledWith(firestore, 'localhost', 8888)
    expect(firestore).toBeDefined()
  })
})
