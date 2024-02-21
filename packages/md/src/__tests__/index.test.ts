import {
  describe, test, expect,
} from 'vitest'
import { join } from 'path'
import { readFileSync } from 'fs'
import { randomUUID } from 'crypto'
import Md from '..'
import { renderToString } from 'react-dom/server'
import {unlinkSync} from 'fs'

describe('Md', () => {
  const md = Md()

  test('extname', () => {
    expect(md.extname).toEqual('.md')
  })

  test('read', () => {
    expect(md.read({ filename: join(__dirname, 'h1.md') })).toEqual({ body: '# H1\n' })
  })

  test('write', () => {
    const tmp = randomUUID()
    md.write({
      filename: join(__dirname, tmp + '.tmp.md'),
      body: tmp
    })

    expect(readFileSync(join(__dirname, tmp + '.tmp.md')).toString()).toEqual(tmp)

    unlinkSync(join(__dirname, tmp + '.tmp.md'))
  })

  test('render', () => {
    expect(md.render({ filename: join(__dirname, 'h1.md') })).toEqual({
      body: `"use strict";
const {jsx: _jsx} = arguments[0];
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    ...props.components
  };
  return _jsx(_components.h1, {
    children: "H1"
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
return {
  default: MDXContent
};
`
    })
  })

  test('write', () => {
    const tmp = randomUUID()
    md.create({ filename: join(__dirname, tmp + '.tmp.md') })

    expect(readFileSync(join(__dirname, tmp + '.tmp.md')).toString()).toEqual(`# ${tmp}.tmp\n\n`)

    unlinkSync(join(__dirname, tmp + '.tmp.md'))
  })

  test('build', () => {
    const tmp = randomUUID()
    md.create({ filename: join(__dirname, tmp + '.tmp.md') })

    renderToString(md.build({ source: join(__dirname, tmp + '.tmp.md') }))

    expect(renderToString(md.build({ source: join(__dirname, tmp + '.tmp.md') }))).toEqual(`<h1>${tmp}.tmp</h1>`)

    unlinkSync(join(__dirname, tmp + '.tmp.md'))
  })

  test('searchableContent', () => {
    const tmp = randomUUID()
    md.create({ filename: join(__dirname, tmp + '.tmp.md') })

    expect(md.searchableContent({ filename: join(__dirname, tmp + '.tmp.md') })).toEqual(`# ${tmp}.tmp\n\n`)

    unlinkSync(join(__dirname, tmp + '.tmp.md'))
  })

  test('search', () => {
    const tmp = randomUUID()
    md.create({ filename: join(__dirname, tmp + '.tmp.md') })

    expect(md.search({
      q: tmp,
      contents: [
        {
          item: {
            type: '.md',
            name: tmp,
            path: tmp,
          },
          content: '# ' + tmp,
        },
      ]
    })).toEqual([
      {
        item: {
          type: '.md',
          name: tmp,
          path: tmp,
        }
      }
    ])

    unlinkSync(join(__dirname, tmp + '.tmp.md'))
  })
})
