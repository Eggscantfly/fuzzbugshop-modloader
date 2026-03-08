# Mods

Drop `.js` or `.lua` files here.

Files starting with `_` are disabled - rename to enable.

## JS mods

Use `ModAPI` to interact with the game:

```js
ModAPI.getPlayer()
ModAPI.getScene()
ModAPI.setConfig("Xe", 2000)  // speed
ModAPI.onUpdate(function() { ... })
```

Add menu options with:

```js
ModMenu.addToggle("Name", getter, setter)
ModMenu.addOption("Name", getter, onClick)
```

## Lua mods

Just set config values:

```lua
config.gravity = 700
config.speed = 2000
config.debug_hitboxes = true
```
