import {
  describe, test, expect
} from 'vitest'
import { join } from 'path'
import { readFileSync } from 'fs'
import { randomUUID } from 'crypto'
import Md from '..'
import { templateRender } from '../build'

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
  })

  test('render', () => {
    expect(md.render({ filename: join(__dirname, 'h1.md') })).toEqual({
      body: `/*@jsxRuntime automatic @jsxImportSource react*/
const {jsx: _jsx} = arguments[0];
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, {})
  })) : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      h1: "h1"
    }, props.components);
    return _jsx(_components.h1, {
      children: "H1"
    });
  }
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
  })

  test('build', () => {
    const tmp = randomUUID()
    md.create({ filename: join(__dirname, tmp + '.tmp.md') })

    md.build({
      source: join(__dirname, tmp + '.tmp.md'),
      destination: join(__dirname, tmp + '.tmp.html'),
    })

    expect(readFileSync(join(__dirname, tmp + '.tmp.html')).toString()).toEqual(templateRender({
      title: tmp + '.tmp',
      body: `<h1>${tmp}.tmp</h1>`,
    }))
  })

  test('searchableContent', () => {
    const tmp = randomUUID()
    md.create({ filename: join(__dirname, tmp + '.tmp.md') })

    expect(md.searchableContent({ filename: join(__dirname, tmp + '.tmp.md') })).toEqual(`# ${tmp}.tmp\n\n`)
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
  })
})
