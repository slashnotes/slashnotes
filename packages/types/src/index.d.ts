export type SlashnotesFile = {
  extname: string
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
