import { build } from '../build'
import { test } from 'uvu'
import { is } from 'uvu/assert'

test('should work', () => {
  is(build('```ts\nconst a = 1\n```'), '<pre data-reactroot=""><code class="hljs language-ts"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>\n</code></pre>')
})

test.run()
