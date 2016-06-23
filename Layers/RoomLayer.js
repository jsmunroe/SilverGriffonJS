function RoomLayer(room) {
    this.room = room;
} 

// Inherit from layer.
RoomLayer.prototype = new Layer();
RoomLayer.prototype.constructor = RoomLayer;

// Update this layer.
RoomLayer.prototype.update = function (gameState) {

}

// Draw this layer.
RoomLayer.prototype.draw = function (context) {
    var tileSet = Game.library.getTileSet("Stone");

    for (var y = 0; y < 9; y++) {
    for (var x = 0; x < 9; x++) {
        var tile = Randomizer.pick(tiles)
        var floor = Randomizer.pickWithFreq(tile.floors, i => i.frequency);
        context.drawImage(floor.image, x * 32, y * 32, 32, 32);
    }
    }
}
