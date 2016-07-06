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
        this.shadowCaster = new ShadowCaster(this.room);
    } 

    // Update this layer.
    update(gameState) {
        var player = this.room.characters.first(i => i.isType[Player]);

        if (!player) {
            return;
        }

        this.shadowCaster.cast(player.x, player.y, 5);
    }

    // Draw this layer.
    draw(context) {
        var library = GameAssets.library;
        var tileSet = library.getTileSet("Stone");

        for (var y = 0; y < this.room.height; y++) {
            for (var x = 0; x < this.room.width; x++) {
                var tileInfo = this.room.getTileInfo(x, y);
                var tileFloor = this.room.getTileFloor(x, y);
                if (tileInfo.isVisible) {
                    context.globalAlpha = 1.0;
                } else if (tileInfo.isSeen) {
                    context.globalAlpha = 0.3;
                } else {
                    context.globalAlpha = 0.0;
                }
            	context.drawImage(tileFloor.image, x * 50, y * 50, 50, 50);
                context.globalAlpha = 1.0;
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
            var tileInfo = this.room.getTileInfo(character.x, character.y);

            if (character.isType[Player] || tileInfo.isVisible) {
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
}
