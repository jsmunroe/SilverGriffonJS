class Game {
    constructor (buffer) {
        this.buffer = buffer;
        this.ctx = buffer.getContext("2d");

        this.library = new Library("data/game.json");

        this.layers = [];
    }

    // Start the game loop.
    start() {
        var self = this;

        if (this.intHandle != void 0) {
            clearInterval(this.intHandle);
        }

        this.intHandle = requestAnimationFrame(function (time) { interval(self, time); });
    }

    // Animation frame.
    interval(game, time) {
        game.update();
        game.draw();

        this.intHandle = requestAnimationFrame(function (time) { interval(game, time); });
    }

    // Update the game.
    update() {
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            layer.update();
        }
    }

    // Draw the game.
    draw(ctx) {
        for (var i = 0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            layer.draw(this.ctx);
        }
    }

    // Add layer.
    addLayer(layer) {
        this.layers.push(layer);
    }

    // Remove layer.
    removeLayer(layer) {
        this.layers = Util.reject(this.layers, function (L) { return L.id === layer.id });
    }
}