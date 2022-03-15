export async function action<TData = any> (name: string, params?: any): Promise<TData> {
  return fetch((import.meta.env.VITE_SERVER || '') + '/__slashnotes/' + name, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(params),
  })
    .then(async response => response.text().then(async res => {
      if (response.status >= 200 && response.status < 300) {
        if (!res)
          return Promise.resolve(null)
        else {
          const body = JSON.parse(res)
          return Promise.resolve(body)
        }
      }
    }))
}
