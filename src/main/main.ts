/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import MenuBuilder from './menu';
import TrayBuilder from './tray';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const store = new Store();

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    // await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  // 关闭时缩小到托盘
  //  开发环境开启会影响热更新
  if (!isDebug) {
    mainWindow.on('close', (e) => {
      e.preventDefault();
      mainWindow?.hide();
      console.log('e close', e);
    });
  }

  mainWindow.on('closed', () => {
    console.log('closed');
    mainWindow = null;
  });

  // 顶栏菜单
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // 托盘菜单
  const trayBuilder = new TrayBuilder(app, mainWindow, {
    iconPath: getAssetPath('icon.png'),
  });
  trayBuilder.buildTray();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

// app.on('before-quit', (e) => {
//   // e.preventDefault();
//   console.log('e before-quit', e);
// });

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.exit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.on('set-mainWindow-size', async (event, args) => {
  mainWindow?.setBounds(args);
});
// IPC listener
ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('get-osInfo', async (event, arg) => {
  const os = require('os');
  event.reply('get-osInfo', {
    hostname: os.hostname(),
    type: os.type(),
    platform: os.platform(),
  });
});

ipcMain.on('save-file', async (event, arg) => {
  const { fileUrl, fileContent } = arg;
  const fs = require('fs');
  fs.writeFileSync(fileUrl, fileContent);
});

ipcMain.on('get-appPath', async (event, arg) => {
  event.reply('get-appPath', app.getPath(arg));
});

ipcMain.on('get-filePath', async (event, arg) => {
  console.log('get-filePath', arg);
  const { fileUrl } = arg;
  const fileUrlRes = await dialog.showOpenDialog({
    title: '选择文件',
    defaultPath: fileUrl || '',
    properties: ['createDirectory', 'openDirectory', 'multiSelections'],
  });
  event.reply('get-filePath', fileUrlRes);
});
