const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { fileURLToPath } = require('url');

const appId = 'com.hollowxtra.cyclonesimbutchaos';
let mainWindow;

function appPath(...parts) {
  return path.join(app.getAppPath(), ...parts);
}

function openLocalFile(filePath) {
  shell.openPath(filePath).catch((error) => {
    console.error(`Unable to open ${filePath}:`, error);
  });
}

function toggleSimulatorFullscreen(window) {
  if (!window || window.isDestroyed()) return;

  window.webContents
    .executeJavaScript('typeof toggleFullscreen === "function" && toggleFullscreen();', true)
    .then((handled) => {
      if (!handled) window.setFullScreen(!window.isFullScreen());
    })
    .catch(() => {
      window.setFullScreen(!window.isFullScreen());
    });
}

function buildMenu() {
  const isDev = !app.isPackaged;
  const viewItems = [
    {
      label: 'Toggle Simulator Fullscreen',
      accelerator: 'F11',
      click: (_item, window) => toggleSimulatorFullscreen(window)
    },
    { type: 'separator' },
    { role: 'resetZoom' },
    { role: 'zoomIn' },
    { role: 'zoomOut' },
    { type: 'separator' },
    { role: 'reload' }
  ];

  if (isDev) {
    viewItems.push({ role: 'forceReload' }, { role: 'toggleDevTools' });
  }

  return Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Restart Simulation',
          accelerator: 'CmdOrCtrl+R',
          click: (_item, window) => window && window.reload()
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: viewItems
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Open Changelog',
          click: () => openLocalFile(appPath('changelog.txt'))
        },
        {
          label: 'Project on GitHub',
          click: () => shell.openExternal('https://github.com/HollowXtra/cyclone-sim-but-chaos')
        }
      ]
    }
  ]);
}

function createWindow() {
  const indexPath = appPath('index.html');

  mainWindow = new BrowserWindow({
    width: 1120,
    height: 720,
    minWidth: 980,
    minHeight: 620,
    show: false,
    backgroundColor: '#bbbbbb',
    icon: appPath('favicon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsed = new URL(navigationUrl);
    if (parsed.protocol === 'file:') {
      const targetPath = path.resolve(fileURLToPath(parsed));
      if (targetPath !== path.resolve(indexPath)) {
        event.preventDefault();
        openLocalFile(targetPath);
      }
      return;
    }

    event.preventDefault();
    shell.openExternal(navigationUrl);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadFile(indexPath);
}

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.setAppUserModelId(appId);

  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(buildMenu());
    createWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
