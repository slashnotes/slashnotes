import { Config } from '..'
import {
  test, expect, describe
} from 'vitest'
import { sep } from 'path'

describe('config', () => {
  test('get', () => {
    expect(Config('get')).toEqual({ sep })
  })

  test('not found', () => {
    expect(() => Config('')).toThrowError('Unknown command: config/')
  })
})
