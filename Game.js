class Game {
    static init (buffer, loadSuccess) {
        Game.buffer = buffer;
        Game.loadSuccess = loadSuccess;
        Game.ctx = buffer.getContext("2d");

        Game.library = new Library("data/game.json", Game.onLoad);

        Game.layers = [];
    }

    // Start the game loop.
    static run() {
        if (Game.intHandle != void 0) {
            clearInterval(Game.intHandle);
        }

        Game.intHandle = requestAnimationFrame(function (time) { Game.interval(time); });
    }

    // Animation frame.
    static interval(game, time) {
        Game.update();
        Game.draw(Game.ctx);

        var next = function () {
            Game.intHandle = requestAnimationFrame(function (time) { Game.interval(game, time); });
        }

        turnManager.step(next);
    }

    // Update the game.
    static update() {
        for (var i = 0; i < Game.layers.length; i++) {
            var layer = Game.layers[i];
            layer.update();
        }
    }

    // Draw the game.
    static draw(ctx) {
        for (var i = 0; i < Game.layers.length; i++) {
            var layer = Game.layers[i];
            layer.draw(ctx);
        }
    }

    // Add layer.
    static addLayer(layer) {
        Game.layers.push(layer);
    }

    // Remove layer.
    static removeLayer(layer) {
        Game.layers = Util.reject(Game.layers, function (L) { return L.id === layer.id });
    }

    // When the library items are completely loaded.
    static onLoad() {
        World.init(new TileSetFactory(Game.library, "Stone"), new RandomRoomBuilderFactory());

        var room = World.room(0,0);
        var player = Game.library.getPlayerCharacter({});
        turnManager.add(player);
        room.placeCharacter(player); 

        //var characters = Game.library.pickRandomCharacters("Sewer");
        //room.placeCharacters(characters);

        // Add room layer.
        var roomLayer = new RoomLayer(room);
        Game.layers.push(roomLayer);

        // Notify client if subscribed.
        if (Game.loadSuccess instanceof Function)
            Game.loadSuccess();
    }
}