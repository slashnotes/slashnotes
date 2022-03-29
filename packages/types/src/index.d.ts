export type SlashnotesFile = {
  /**
   * extension of the file, e.g. `.md`
   */
  extname: string
  /**
   * read the file to editor
   */
  read(props: {
    filename: string
  }): string
  /**
   * write to local file
   */
  write(props: {
    filename: string
    body: string
  }): void
  /**
   * render file to MDX component
   */
  render(props: {
    filename: string
  }): string
  /**
   * create a new file
   */
  create(props: {
    filename: string
  })
}

export type SlashnotesItem = {
  type: string
  name: string
  path: string
  paths: string[]
}
