import { build } from '../build'
import { test, expect } from 'vitest'
import { defaultOptions } from '..'
import { renderToString } from 'react-dom/server'

test('should work', () => {
  expect(renderToString(build('line1\n\nline2', defaultOptions))).toEqual('<p>line1</p>\n<p>line2</p>')

  expect(renderToString(build('```ts\nconst a = 1\n```', defaultOptions)))
    .toEqual('<pre><code class="hljs language-ts"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>\n</code></pre>')

  expect(renderToString(build(`\`\`\`mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
\`\`\``, defaultOptions)))
    .toEqual('<pre class="mermaid">graph TD;\nA--&gt;B;\nA--&gt;C;\nB--&gt;D;\nC--&gt;D;</pre>')

  expect(renderToString(build('```mermaid\n<br />\n```', defaultOptions)))
    .toEqual('<pre class="mermaid">&lt;br /&gt;</pre>')

  expect(renderToString(build('{a b}', defaultOptions))).toEqual('<p>{a b}</p>')
})
