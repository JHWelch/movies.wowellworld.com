import { describe, expect, it } from '@jest/globals'
import { initializeApp } from 'firebase/app'
import { applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase/firestore'
import setupFirestore from '../../src/config/firestore'

describe('setupFirestore', () => {
  it('initializes the firestore', () => {
    const firestore = setupFirestore()

    expect (applicationDefault).toHaveBeenCalledTimes(1)
    expect (initializeApp).toHaveBeenCalledTimes(1)
    expect (getFirestore).toHaveBeenCalledTimes(1)
    expect(firestore).toBeDefined()
  })
})
