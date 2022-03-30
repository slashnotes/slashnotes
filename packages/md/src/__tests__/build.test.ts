import { build } from '../build'
import { test, expect } from 'vitest'

test('should work', () => {
  expect(build('```ts\nconst a = 1\n```'))
    .toEqual('<pre><code class="hljs language-ts"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>\n</code></pre>')
})
