class Layer{
    constructor() {

    }

    // Update this layer.
    update(gameState) {

    };

    // Draw this layer.
    draw(context) {

    };

}





class RoomLayer extends Layer {
    constructor(room) {
        this.room = room;
    } 

    // Update this layer.
    update(gameState) {

    }

    // Draw this layer.
    draw(context) {
        var tileSet = Game.library.getTileSet("Stone");

        for (var y = 0; y < 9; y++) {
            for (var x = 0; x < 9; x++) {
                var tile = Randomizer.pick(tiles)
                var floor = Randomizer.pickWithFreq(tile.floors, i => i.frequency);
                context.drawImage(floor.image, x * 32, y * 32, 32, 32);
            }
        }
    }
}
