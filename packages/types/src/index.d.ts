export type SlashnotesFile = {
  /**
   * extension of the file, e.g. `.md`
   */
  extname: string
  /**
   * read the file
   */
  read(props: {
    folder: string
    path: string
  }): string
  parse(props: {
    folder: string
    path: string
  }): string

}

export type SlashnotesItem = {
  type: string
  name: string
  path: string
  paths: string[]
}
