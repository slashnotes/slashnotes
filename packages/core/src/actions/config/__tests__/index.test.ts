import { Config } from '..'
import { test, expect } from 'vitest'
import { sep } from 'path'

test('config', () => {
  expect(Config('get')).toEqual({ sep })
})
