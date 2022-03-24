import { parse } from '../parse'

describe('parse', () => {
  it.each([
    1,
    2,
    3,
    4,
    5,
    6
  ])('h%s', (level) => {
    expect(parse(new Array(level).fill('#').join('') + ' h' + level)).toEqual(`<h${level}>h${level}</h${level}>\n`)
  })

  it('p', () => {
    expect(parse('p')).toEqual('<p>p</p>\n')
  })

  describe('javascript', () => {
    it('math', () => {
      expect(parse('1 + 1 = {1+1}')).toMatch(/<p>1 \+ 1 = <span id="user-content-[0-9a-z-]+"><\/span><script type="module">document\.getElementById\('user-content-[0-9a-z-]+'\)\.innerHTML=1\+1<\/script><\/p>/)
      expect(parse('1 + 1 = \n{\n1+1\n}')).toMatch(/<p>1 \+ 1 =<\/p>\n<span id="user-content-[0-9a-z-]+"><\/span><script type="module">document\.getElementById\('user-content-[0-9a-z-]+'\)\.innerHTML=\n1\+1\n<\/script>/)
    })

    it('function', () => {
      expect(parse('{(function now() {return Date.now()})()}'))
        .toMatch(/<span id="user-content-[0-9a-z-]+"><\/span><script type="module">document\.getElementById\('user-content-[0-9a-z-]+'\)\.innerHTML=\(function now\(\) {return Date\.now\(\)}\)\(\)<\/script>/)
    })
  })
})
