# Code Reference

Variable mappings for the obfuscated game code.

## Config values

| Minified | Meaning |
|----------|---------|
| Xe | base speed (1080) |
| ic | gravity (1400) |
| Ve | debug hitboxes |
| We | easy mode |
| _e | questions per level |

## PlayScene variables

| Minified | Meaning |
|----------|---------|
| this.Ah | player |
| this.Sb | speed |
| this.Ng | score |
| this.Mg | isPlaying |
| this.Ig | gameOver |

## Player methods

| Method | What it does |
|--------|--------------|
| vc(vel) | set Y velocity |
| Gc(vel) | set X velocity |
| Nc(x, y) | reset position |
| pc(hat) | equip hat |

## Classes

| Obfuscated | Actual |
|------------|--------|
| FuzzbugHop.$ | BootState |
| FuzzbugHop.aa | TitleScene |
| FuzzbugHop.ba | InstructionScene |
| FuzzbugHop.ca | PlayScene |
| FuzzbugHop.Mb | Player |
| FuzzbugHop.bh | Platform |
| FuzzbugHop.mh | GoalPlatform |
| FuzzbugHop.ph | GameUI |
