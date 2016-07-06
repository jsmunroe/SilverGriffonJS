class GameTypes {
    static get game() { return 'game'; }
    static get world() { return 'world'; }
    static get library() { return 'library'; }
    static get turnManager() {return 'turnManager';}
    static get inputService() {return 'inputService';}
}

class GameAssets {
    static get game() { return TypeContainer.resolve(GameTypes.game); }
    static get world() { return TypeContainer.resolve(GameTypes.world); }
    static get library() { return TypeContainer.resolve(GameTypes.library); }
    static get turnManager() { return TypeContainer.resolve(GameTypes.turnManager); }
    static get inputService() { return TypeContainer.resolve(GameTypes.inputService); }
}

(function($) {
    class Game {
        get world() { return GameAssets.world; }

        get library() { return GameAssets.library; }
        
        init (buffer, loadSuccess) {
            this.buffer = buffer;
            this.loadSuccess = loadSuccess;
            this.ctx = buffer.getContext("2d");

            this.library.init("data/game.json", () => this.onLoad());

            this.layers = [];
        }

        // Start the game loop.
        run() {
            var self = this;

            if (this.intHandle != void 0) {
                clearInterval(this.intHandle);
            }

            this.intHandle = requestAnimationFrame((time) => self.interval(time));
        }

        // Animation frame.
        interval(game, time) {
            var self = this;

            this.update();
            this.draw(this.ctx);
            
            var next = function () {
                self.intHandle = requestAnimationFrame((time) => self.interval(game, time));
            }

            GameAssets.turnManager.step(next);
        }

        // Update the this.
        update() {
            for (var i = 0; i < this.layers.length; i++) {
                var layer = this.layers[i];
                layer.update();
            }
        }

        // Draw the this.
        draw(ctx) {
            ctx.clearRect(0, 0, this.buffer.width, this.buffer.height);

            for (var i = 0; i < this.layers.length; i++) {             
                var layer = this.layers[i];
                layer.draw(ctx);
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

        // When the library items are completely loaded.
        onLoad() {
            var room = this.world.room(0,0);

            var player = this.library.getPlayerCharacter({});
            GameAssets.turnManager.add(player);
            room.placeCharacter(player); 

            var characters = this.library.pickRandomCharacters("Sewer");
            room.placeCharacters(characters);

            // Add room layer.
            var roomLayer = new RoomLayer(room);
            this.layers.push(roomLayer);

            // Add character layer.
            var characterLayer = new CharacterLayer(room);
            this.layers.push(characterLayer);

            // Notify client if subscribed.
            if (this.loadSuccess instanceof Function)
                this.loadSuccess();
        }
    }

    TypeContainer.register(GameTypes.game, () => new Game());
})(jQuery);