/* eslint-disable no-useless-escape */
import {
  describe, test, expect
} from 'vitest'
import { parse } from '../parse'
import { defaultOptions } from '..'

describe('parse', () => {
  test('mdx', () => {
    expect(parse('# H1\n{1 + 1}', defaultOptions)).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
const {Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs} = arguments[0];
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, {})
  })) : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      h1: "h1"
    }, props.components);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.h1, {
        children: "H1"
      }), \"\\n\", 1 + 1]
    });
  }
}
return {
  default: MDXContent
};
`)
  })

  test('downgrade mdx to md', () => {
    expect(parse('# H1\n{ "a": 1 }', defaultOptions)).toEqual(`/*@jsxRuntime automatic @jsxImportSource react*/
const {Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs} = arguments[0];
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, {})
  })) : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      h1: "h1",
      p: "p"
    }, props.components);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.h1, {
        children: "H1"
      }), \"\\n\", _jsx(_components.p, {
        children: \"{ \\\"a\\\": 1 }\"
      })]
    });
  }
}
return {
  default: MDXContent
};
`)
  })
})
