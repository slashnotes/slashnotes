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
  }): {
    body: string
  }
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
  }): {
    body: string
  }
  /**
   * create a new file
   */
  create(props: {
    filename: string
  }): void
  /**
   * build file to html
   */
  build(props: {
    source: string
    destination: string
  }): void
  searchableContent(props: { filename: string }): any
  search(props: {
    q: string
    contents: {
      item: SlashnotesItem
      content: any
    }[]
  }): {
    item: SlashnotesItem
  }[]
}

export type SlashnotesItem = {
  type: string
  name: string
  path: string
}

export type SlashnotesConfig = {
  sep: string
}
