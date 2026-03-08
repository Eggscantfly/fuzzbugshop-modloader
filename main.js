const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Mod loader for Electron main process
// Loads .lua and .js mods from the mods/ folder

let mainWindow = null;

// Read mods
const modsDir = path.join(__dirname, 'mods');
const loadedLuaMods = [];
const loadedJsMods = [];

function loadMods() {
    if (!fs.existsSync(modsDir)) {
        console.log('[Main] No mods folder found');
        return;
    }

    const files = fs.readdirSync(modsDir);
    
    for (const file of files) {
        // Skip disabled mods (starting with _)
        if (file.startsWith('_')) continue;
        
        const filePath = path.join(modsDir, file);
        
        if (file.endsWith('.lua')) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                loadedLuaMods.push({ name: file, content });
                console.log('[Main] Lua mod:', file);
            } catch (e) {
                console.error('[Main] Failed to load', file, e);
            }
        } else if (file.endsWith('.js') && file !== 'README.md') {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                loadedJsMods.push({ name: file, content });
                console.log('[Main] JS mod:', file);
            } catch (e) {
                console.error('[Main] Failed to load', file, e);
            }
        }
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 768,
        height: 1024,
        title: 'Fuzz Bugs Factory Hop',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            webSecurity: true
        },
        autoHideMenuBar: true
    });

    // Use loadURL with file:// protocol for older Electron compatibility
    const indexPath = path.join(__dirname, 'index.html');
    mainWindow.loadURL('file://' + indexPath.replace(/\\/g, '/'));

    // Pass mods data to renderer
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`
            window.LOADED_MODS = ${JSON.stringify(loadedLuaMods)};
            window.LOADED_JS_MODS = ${JSON.stringify(loadedJsMods)};
        `);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Load mods before creating window
loadMods();

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
