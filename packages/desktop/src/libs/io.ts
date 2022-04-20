export function selectFolder () {
  return (window as unknown as {
    Server: {
      selectFolder: () => Promise<string>
    }
  }).Server.selectFolder()
}
