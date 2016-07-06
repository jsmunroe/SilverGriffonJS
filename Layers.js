class Layer{
    constructor() {
        Layer.nextId = Layer.nextId || 0;
        this.Id = Layer.nextId++;
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
        var library = GameAssets.library;
        var tileSet = library.getTileSet("Stone");

        for (var y = 0; y < this.room.height; y++) {
            for (var x = 0; x < this.room.width; x++) {
                var tileFloor = this.room.getTileFloor(x, y);
            	context.drawImage(tileFloor.image, x * 50, y * 50, 50, 50);
            }
        }
    }
}

class CharacterLayer extends Layer {
    constructor(room) {
        super();
        this.room = room;
    }

    // Update this layer.
    update(gameState) {

    }

    // Draw this layer.
    draw(context) {
        for (var i = 0; i < this.room.characters.length; i++) {
            var character = this.room.characters[i];

            if (character.facing === 'right') {
                context.save();
                context.scale(-1, 1);
                context.drawImage(character.image, -character.x * 50, character.y * 50, -50, 50);
                context.restore();
            } else {
                context.drawImage(character.image, character.x * 50, character.y * 50, 50, 50);
            }
        }
    }
}
