export async function action (name: string) {
  return fetch('/__slashnotes/' + name)
    .then(async res => res.json())
}
