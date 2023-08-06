/* eslint-disable promise/always-return */

import { BrowserWindow, app as electronApp } from 'electron';

/* eslint-disable promise/catch-or-return */
const { Menu, Tray } = require('electron');

class TrayBuilder {
  mainWindow: BrowserWindow;

  app: typeof electronApp;

  options: any;

  constructor(
    app: typeof electronApp,
    mainWindow: BrowserWindow,
    options: any
  ) {
    this.app = app;
    this.mainWindow = mainWindow;
    this.options = options;
  }

  buildTray(): any {
    const tray = new Tray(this.options.iconPath);
    const contextMenu = Menu.buildFromTemplate([
      { label: 'checkbox', type: 'checkbox' },
      { label: 'separator', type: 'separator' },
      { label: 'radio', type: 'radio', checked: true },
      { label: 'radio1', type: 'radio' },
      {
        label: 'normal',
        type: 'normal',
        click: () => {
          this.app.exit();
        },
      },
      {
        label: 'submenu',
        submenu: [
          {
            label: 'submenu1',
            type: 'normal',
          },
        ],
      },
    ]);
    tray.setToolTip('This is my application.');
    tray.setContextMenu(contextMenu);
    tray.addListener('double-click', () => {
      this.mainWindow.show();
    });
    return tray;
  }
}

export default TrayBuilder;
