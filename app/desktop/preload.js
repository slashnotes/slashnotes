const { contextBridge, ipcRenderer, shell } = require('electron')
const { randomUUID } = require('crypto')

contextBridge.exposeInMainWorld('Server', {
  action: (name, params) => {
    const id = randomUUID()

    ipcRenderer.send('request', id, name, params)

    return new Promise((resolve, reject) => {
      ipcRenderer.once(`response-${id}`, (_, data) => {
        console.debug(`response-${id}`, data)
        if (data.error) reject(data.error)
        else resolve(data.data)
      })
    })
  },
  selectFolder: () => {
    ipcRenderer.send('select-folder')

    return new Promise((resolve, reject) => {
      ipcRenderer.once('selected-folder', (_, data) => {
        console.debug('selected-folder', data)
        if (!data) reject(Error('Canceled'))
        resolve(data)
      })
    })
  },
  openFolder: path => {
    shell.openPath(path)
  },
})

ipcRenderer.on('update-downloaded', () => {
  if (
    window.confirm(
      'New version has been downloaded, do you want to install it now?'
    )
  )
    ipcRenderer.send('restart-app')
})
