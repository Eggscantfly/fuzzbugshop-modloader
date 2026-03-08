// fps unlock + counter

(function() {
    var div = null;
    var frames = 0;
    var last = 0;
    
    function unlock() {
        if (!window.game || !window.game.time) {
            setTimeout(unlock, 200);
            return;
        }
        
        game.time.advancedTiming = true;
        game.forceSingleUpdate = false;
        if (game.time.desiredFps !== undefined) game.time.desiredFps = 144;
        
        div = document.createElement('div');
        div.style.cssText = 'position:fixed;top:5px;left:5px;color:#0f0;font:bold 14px monospace;z-index:99999;text-shadow:1px 1px #000;pointer-events:none;';
        document.body.appendChild(div);
        
        last = performance.now();
        (function loop() {
            frames++;
            var now = performance.now();
            if (now - last >= 1000) {
                div.textContent = 'FPS: ' + Math.round(frames * 1000 / (now - last));
                frames = 0;
                last = now;
            }
            requestAnimationFrame(loop);
        })();
    }
    
    unlock();
})();
