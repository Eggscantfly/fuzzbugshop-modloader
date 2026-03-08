// =====================================================
// TWO PLAYER MOD
// Player 2: WASD controls, Blue color
// Rename to "two_player.js" to enable
// =====================================================

ModAPI.log("Two Player mod loading...");

var P2 = null;
var P2score = 0;
var P2dead = false;

// Create P2 when game starts
ModAPI.onUpdate(function() {
    var scene = ModAPI.getScene();
    if (!scene || P2) return;
    
    // Create Player 2 on opposite side
    var p1 = scene.Ah;
    if (!p1) return;
    
    P2 = new FuzzbugHop.Mb(game, game.width - p1.ec.x, p1.ec.y, FuzzbugHop.Ib);
    P2.fc.ui({value: "blue"});
    P2.fc.pi(11394524); // Blue tint
    game.world.bringToTop(P2);
    
    ModAPI.log("Player 2 created! Use WASD to move.");
});

// P2 WASD Controls
ModAPI.onUpdate(function() {
    if (!P2 || P2dead) return;
    
    if (ModAPI.isKeyDown('A')) {
        P2.Gc(-400);
    } else if (ModAPI.isKeyDown('D')) {
        P2.Gc(400);
    } else {
        P2.Gc(0);
    }
});

// P2 Collisions
ModAPI.onUpdate(function() {
    if (!P2 || P2dead) return;
    var scene = ModAPI.getScene();
    if (!scene || !scene.ah) return;
    
    // Platform collisions
    game.physics.arcade.collide(P2.ec, scene.ah, function(p2body, platform) {
        if (p2body.body.touching.down) {
            P2.vc(-scene.Sb * platform.ii);
        }
    });
    
    // Ground collision (death/respawn)
    game.physics.arcade.overlap(P2.ec, scene.$g, function() {
        if (P2score > 0 && !P2dead) {
            P2dead = true;
            P2.Nc(-200, -200);
            setTimeout(function() {
                P2dead = false;
                P2.Nc(game.rnd.integerInRange(100, game.width-100), 100);
                P2.vc(-scene.Sb);
                P2.fc.ui({value: "blue"});
                P2.fc.pi(11394524);
            }, 2000);
        } else if (!P2dead) {
            P2.vc(-scene.Sb);
        }
    });
    
    // Pickup collisions
    if (scene.fh) {
        game.physics.arcade.collide(P2.dc, scene.fh, function(p2body, pickup) {
            if (!pickup.mi) return;
            var type = pickup.mi.type;
            if (type === "hat") {
                P2.pc(pickup.mi);
                P2score += 50;
            } else if (type === "glasses") {
                P2.fc.oi(pickup.mi);
                P2score += 30;
            } else if (type === "brush") {
                P2score += 20;
            }
            pickup.kill();
        });
    }
});

ModAPI.log("Two Player mod loaded!");
