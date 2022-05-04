export function selectFolder () {
  return (window as unknown as {
    Server: {
      selectFolder: () => Promise<string>
    }
  }).Server.selectFolder()
}

export function openFolder (path: string) {
  return (window as unknown as {
    Server: {
      openFolder: (path: string) => void
    }
  }).Server.openFolder(path)
}
