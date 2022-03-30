export class Builder {
  public readonly folder: string

  constructor (options?: { folder?: string }) {
    this.folder = process.env.FOLDER || options?.folder || process.cwd()
  }
}
