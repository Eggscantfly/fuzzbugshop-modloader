// mod menu - TAB to open/close

(function() {
    var godMode = false;
    var jumpMult = 1.0;
    var gravMult = 1.0;
    
    function init() {
        if (!window.game || !window.game.state || !window.game.state.states['PlayScene']) {
            setTimeout(init, 500);
            return;
        }
        
        if (!window.ModMenu || !ModMenu.addToggle) {
            setTimeout(init, 500);
            return;
        }
        
        ModMenu.addToggle("God Mode", function() { return godMode; }, function(v) { godMode = v; });
        
        ModMenu.addOption("Jump Force", function() { return jumpMult + "x"; }, function() {
            var j = [0.5, 1.0, 1.5, 2.0, 3.0];
            jumpMult = j[(j.indexOf(jumpMult) + 1) % j.length];
            applyJump();
        });
        
        ModMenu.addOption("Gravity", function() { return gravMult + "x"; }, function() {
            var g = [0.25, 0.5, 1.0, 1.5, 2.0];
            gravMult = g[(g.indexOf(gravMult) + 1) % g.length];
            applyGravity();
        });
    }
    
    function applyJump() {
        // Sb is the jump multiplier used in PlayScene
        var scene = window.ModAPI && ModAPI.getScene();
        if (scene) {
            scene.Sb = FuzzbugHop.config.Xe * jumpMult;
        }
    }
    
    function applyGravity() {
        var player = window.ModAPI && ModAPI.getPlayer();
        if (player && player.ec && player.ec.body) {
            // hc is the base gravity stored on player
            var baseGrav = player.hc || 1400;
            player.ec.body.gravity.y = baseGrav * gravMult;
        }
    }
    
    // apply god mode each frame
    setInterval(function() {
        if (godMode && window.ModAPI) {
            var p = ModAPI.getPlayer();
            if (p) p.Nb = false;
        }
        
        // keep gravity applied (it can reset on bounce)
        if (gravMult !== 1.0) {
            applyGravity();
        }
    }, 100);
    
    init();
})();
