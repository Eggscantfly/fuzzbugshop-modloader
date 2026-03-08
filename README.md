# Fuzz Bugs Factory Hop - Mod Loader

Mod loader for the ABCya Fuzz Bugs Factory Hop game (Microsoft Store version).

## Setup

### If you already own the game

1. Find your game installation folder (look for `app.min.js`)
2. Copy everything from this repo into the `resources/app/` folder
3. Run the game

### Fresh install

Run `install.bat` - it'll download the game and set everything up.

Needs Python 3. The script grabs the game from rg-adguard (~50MB) and installs the mod loader.

## Usage

Press TAB in-game to open the mod menu.

Mods go in the `mods/` folder. Files starting with `_` are disabled.

## Included mods

- `fps_unlock.js` - removes 60fps cap, shows fps counter
- `mod_menu.js` - the TAB menu with god mode, speed, gravity
- `_two_player.js` - co-op mode (disabled by default)
- `_moon_mode.lua` - low gravity
- `_speed_boost.lua` - faster movement
- `_easy_mode.lua` - fewer questions per level

## Writing mods

JS mods have access to `ModAPI`:

```js
ModAPI.getPlayer()      // player object
ModAPI.getScene()       // current scene
ModAPI.setConfig(k, v)  // change config values
ModAPI.onUpdate(fn)     // run every frame
```

Lua mods are simpler, just set config values:

```lua
config.gravity = 700
config.speed = 2000
```

Check `docs/CODE_REFERENCE.md` for variable names.

## Notes

This repo doesn't include any game files - you need to get those from the Microsoft Store or rg-adguard.
