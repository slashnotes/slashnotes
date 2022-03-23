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
    expect(parse('1 + 1 = {1+1}')).toEqual('<p>1 + 1 = <script type="module">1+1</script></p>\n')
  })
})
