import { build, templateRender } from '../build'
import { test, expect } from 'vitest'
import { defaultOptions } from '..'

test('should work', () => {
  expect(build('line1\n\nline2', defaultOptions)).toEqual(templateRender({ body: '<p>line1</p>\n<p>line2</p>' }))

  expect(build('```ts\nconst a = 1\n```', defaultOptions))
    .toEqual(templateRender({ body: '<pre><code class="hljs language-ts"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>\n</code></pre>' }))

  expect(build(`\`\`\`mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
\`\`\``, defaultOptions))
    .toEqual(templateRender({ body: '<pre class="mermaid">graph TD;\nA--&gt;B;\nA--&gt;C;\nB--&gt;D;\nC--&gt;D;</pre>' }))

  expect(build('```mermaid\n<br />\n```', defaultOptions))
    .toEqual(templateRender({ body: '<pre class="mermaid">&lt;br /&gt;</pre>' }))

  expect(build('{a b}', defaultOptions)).toEqual(templateRender({ body: '<p>{a b}</p>' }))
})
