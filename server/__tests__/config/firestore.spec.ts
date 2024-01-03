import { describe, expect, it } from '@jest/globals'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase/firestore'
import setupFirestore from '../../src/config/firestore'
import { mockConfig } from '../support/mockConfig'

describe('setupFirestore', () => {
  it('initializes the firestore', () => {
    const firestore = setupFirestore(mockConfig())

    expect(applicationDefault).toHaveBeenCalledTimes(1)
    expect(initializeApp).toHaveBeenCalledTimes(1)
    expect(getFirestore).toHaveBeenCalledTimes(1)
    expect(firestore).toBeDefined()
  })
})
