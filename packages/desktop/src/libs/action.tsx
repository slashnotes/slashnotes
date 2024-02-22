export async function action<TData = any>(
  name: string,
  params?: any
): Promise<TData> {
  return (
    window as unknown as {
      Server: {
        action: (name: string, params: any) => Promise<any>
      }
    }
  ).Server.action(name, params)
    .then(async res => {
      console.debug('response', res)
      if (!res) return Promise.resolve(null)

      return Promise.resolve(res)
    })
    .catch(err => {
      console.error('response', err)
      alert(err)
    })
}
