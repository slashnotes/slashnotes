const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const { autoUpdater } = require('electron-updater')
const { join } = require('path')

if (require('electron-squirrel-startup')) {
  app.quit()
}

const isDev = process.env.APP_ENV === 'development'

let ws
const requests = {}

if (isDev) {
  const webSocket = require('ws')
  let timer
  const reconnect = () => {
    timer = setTimeout(() => {
      if (!ws) reconnect()

      console.log('Try reconnecting...')
      clearTimeout(timer)
      connect()
    }, 500)
  }

  const connect = () => {
    try {
      const dev = new webSocket('ws://localhost:4000')

      dev.on('open', () => {
        console.log('Dev server connected.')
        ws = dev
      })

      dev.on('message', function message(res) {
        console.log('received: %s', res)
        const data = JSON.parse(res)
        requests[data.id](`response-${data.id}`, data)
      })

      dev.on('close', () => {
        dev.terminate()
        ws = null

        reconnect()
      })
    } catch (error) {
      console.error(error)
    }
  }

  connect()
}

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    icon: 'logo.ico',
    backgroundColor: '#252526',
    webPreferences: { preload: join(app.getAppPath(), 'preload.js') },
  })
  mainWindow.maximize()
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000/')
    mainWindow.webContents.openDevTools()

    return
  }

  mainWindow.once('ready-to-show', () => {
    autoUpdater.on('update-downloaded', () =>
      mainWindow.webContents.send('update-downloaded')
    )

    autoUpdater.checkForUpdatesAndNotify()
  })

  mainWindow.loadFile(
    require
      .resolve('@slashnotes/desktop')
      .replace('index.js', join('dist', 'index.html'))
  )
}

app.on('ready', () => {
  if (isDev) {
    ipcMain.on('request', (event, id, name, params) => {
      console.log(id, name, params)

      requests[id] = event.reply

      ws.send(
        JSON.stringify({
          id,
          name,
          params,
        })
      )
    })
  } else {
    const Md = require(
      require.resolve('@slashnotes/md').replace('index.js', 'index.cjs')
    ).default()
    const { Actions } = require(
      require.resolve('@slashnotes/core').replace('index.js', 'index.cjs')
    )
    ipcMain.on('request', (event, id, name, params) => {
      console.log(id, name, params)

      event.reply(
        `response-${id}`,
        Actions(name, params, { files: { '.md': Md } })
      )
    })
  }

  ipcMain.on('select-folder', event => {
    dialog
      .showOpenDialog(mainWindow, { properties: ['openDirectory'] })
      .then(res => event.reply('selected-folder', res.filePaths[0]))
  })

  ipcMain.on('restart-app', () => autoUpdater.quitAndInstall())

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
