import { A } from './a'
import { Heading } from './heading'
import { Pre } from './pre'

export const components = {
  a: A,
  h2: Heading(2),
  h3: Heading(3),
  h4: Heading(4),
  h5: Heading(5),
  h6: Heading(6),
  pre: Pre,
}
