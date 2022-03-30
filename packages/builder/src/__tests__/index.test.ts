import { Builder } from '..'
import { test, expect } from 'vitest'
import { readFileSync } from 'fs'

test('should work', () => {
  const builder = new Builder({ folder: __dirname })
  builder.build(__dirname + '/dist')

  expect(readFileSync(__dirname + '/dist/cases/basic.html').toString()).toEqual('<h1>h1</h1>')
})
