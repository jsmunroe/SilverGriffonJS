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
        super();
        this.room = room;
    } 

    // Update this layer.
    update(gameState) {

    }

    // Draw this layer.
    draw(context) {
        var tileSet = Game.library.getTileSet("Stone");

        for (var y = 0; y < this.room.height; y++) {
            for (var x = 0; x < this.room.width; x++) {
                var tileFloor = this.room.getTileFloor(x, y);
            	context.drawImage(tileFloor.image, x * 50, y * 50, 50, 50);
            }
        }
    }
}