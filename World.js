const roomWidth = 15;
const roomHeight = 15;

class World {
    // Initialize the world.
    static init(tileSetFactory, roomBuilderFactory) {
        World.tileSetFactory = tileSetFactory;
        World.roomBuilderFactory = roomBuilderFactory;
    }

    // Get room a x and y coordinates.
    static room(x, y) {
        if (!World.rooms)
            World.rooms = {};

        var room = World.rooms[x+":"+y]
        if (!room) {
            room = World.buildRoom();
            World.rooms[x+":"+y] = room;
        }
            
        return room;       
    }

    // Build and return a room.
    static buildRoom() {
        var builder = World.roomBuilderFactory.create();
        var tileSet = World.tileSetFactory.create();

        var room = builder.build({
            width: roomWidth,
            height: roomHeight,
            tileSet: tileSet,
        });

        return room;
    }
}



class Room {
    constructor(options) {
        var actual = _.defaults(options || {}, {
            width: 9,
            height: 9,
            tileSet: null,
            tiles: []
        });

        if (!actual.tileSet)
            throw new Error("tileSet not provided!");

        this.width = actual.width;
        this.height = actual.height;
        this.tileSet = actual.tileSet;
        this.tiles = actual.tiles;
    }

    getTileFloor(x, y) {
        var tileInfo = this.tiles[y * this.width + x];
        
        if (!tileInfo) 
            return void 0;
        
        var tileType = tileInfo.tileType;
        var floorId = tileInfo.floorId;

        var tile = this.tileSet[tileType];

        if (!tile)
            return void 0;

        var floor = tile.floors[floorId];
        
        return floor;
    }

    getTilePassible(x, y) {
        return true;
    }

    getTileIsType(tileType) {
        var tileInfo = this.tiles[y * this.width + x];
        
        if (!tileInfo) 
            return void 0;
        
        return tileInfo.tileType == tileType;
    }
}




class RandomRoomBuilderFactory {
    create() {
        var builders = [
            RoomBuilder
        ];

        var constructor = Randomizer.pick(builders);

        return new constructor();
    }
} 





// Builds a rectangular room.
class RoomBuilder {
    build(options) {
        var actual = _.defaults(options || {}, {
            width: 9,
            height: 9,
            tileSet: null,
            exits: {},
        });

        if (!actual.tileSet) throw new Error("tileSet not provided!");

        var tiles = [];

        for (var y = 0; y < actual.height; y++) {
            for (var x = 0; x < actual.width; x++) {
                if (x == 0 || y == 0 || x == actual.width - 1 || y == actual.height - 1) {
                    tiles[y * actual.width + x] = this.pickTile(actual.tileSet, "wall");
                }
                else {
                    tiles[y * actual.width + x] = this.pickTile(actual.tileSet, "floor");
                }
            }
        }

        var room = new Room({
           width: actual.width,
           height: actual.height,
           tileSet: actual.tileSet,
           tiles: tiles,
           exits: actual.exits, 
        });

        return room;
    }

    pickTile(tileSet, tileType) {
        return { 
            floorId: this.pickFloorIndex(tileSet[tileType]),
            tileType: tileType 
        };
    }

    pickFloorIndex(tile) {
        if (!tile || !tile.floors)
            return -1;

        return Randomizer.pickIndexWithFreq(tile.floors, i => i.frequency);
    }
}

// Builds a rectangular room with a maze in it.
class MazeRoomBuilder extends RoomBuilder {

}