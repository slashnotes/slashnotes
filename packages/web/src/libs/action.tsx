export async function action (name: string, params?: any) {
  console.log(import.meta.env)
  return fetch((import.meta.env.VITE_SERVER || '') + '/__slashnotes/' + name, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(params),
  })
    .then(async res => res.json())
}
