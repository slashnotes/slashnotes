import { parse } from '../parse'

describe('mark', () => {
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

  it('javascript', () => {
    expect(parse('1 + 1 = {1+1}')).toMatch(/<p>1 \+ 1 = <span id="user-content-[0-9a-z-]+"><\/span><script type="module">document\.getElementById\('user-content-[0-9a-z-]+'\)\.innerHTML = 1\+1<\/script><\/p>/)
  })
})
