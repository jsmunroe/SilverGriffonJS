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
            MazeRoomBuilder
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
    build(options) {
        var actual = _.defaults(options || {}, {
            width: 9,
            height: 9,
            tileset: null,
            exists: {},
        });

        var maze = new Maze(Math.floor(actual.width / 2), Math.floor(actual.height / 2));
        maze.build();
        var mazeTiles = maze.getMap();

        var tiles = [];

        for (var y = 0; y < actual.height; y++) {
            for (var x = 0; x < actual.width; x++) {
                if (mazeTiles[y * actual.width + x] == 1) {
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

    node (x,y) {
        return x+','+y;
    }
}

class Maze {
    constructor(width,height) {
        this.width = width || 9;
        this.height = height || 9;
        this.cells = new Array(this.width * this.height)

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.cells[y * this.width + x] = new MazeCell(this, x, y);
            }
        }
    }

    getCell(x, y, temp) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return void 0;
            
        var cell = this.cells[y * this.width + x];
        if (cell)
            cell.temp = temp;

        return cell;
    }

    build() {
        var currentX = Math.floor(Math.random() * this.width);
        var currentY = Math.floor(Math.random() * this.height);
        var current = this.getCell(currentX, currentY);
        current.visited = true;

        var cellStack = [];

        while(true) {
            var neighbors = current.getUnvistedNeighbors();
            if (neighbors.length > 0) {
                var neighbor = Randomizer.pick(neighbors);
                cellStack.push(current);

                // Drop walls between cells.
                if (neighbor.temp == 'north') {
                    current.northWall = false;
                    neighbor.southWall = false;
                }
                else if (neighbor.temp == 'south') {
                    current.southWall = false;
                    neighbor.northWall = false;
                }
                else if (neighbor.temp == 'east') {
                    current.eastWall = false;
                    neighbor.westWall = false;
                }
                else if (neighbor.temp == 'west') {
                    current.westWall = false;
                    neighbor.eastWall = false;
                }

                current = neighbor;
                current.visited = true;
            }
            else if (cellStack.length > 0) {
                current = cellStack.pop();
            }
            else {
                break;
            }
        }
    }

    // Get a map array.
    //  0 = no wall
    //  1 = wall
    getMap() {
        var mapWidth = this.width * 2 + 1;
        var mapHeight = this.height * 2 + 1;
        var tiles = new Array(mapWidth * mapHeight).fill(1);
        var getTile = (x,y) => tiles[y * mapWidth + x];
        var setTile = (x,y,val) => tiles[y * mapWidth + x] = val;

        for (var y = 0; y < this.width; y++) {
            for (var x = 0; x < this.height; x++) {
                var cell = this.getCell(x, y);
                var tileX = x * 2 + 1;
                var tileY = y * 2 + 1;
                
                setTile(tileX + 0, tileY - 1, cell.northWall ? 1 : 0) // north
                setTile(tileX - 1, tileY + 0, cell.westWall ? 1 : 0) // north
                setTile(tileX + 0, tileY + 0, cell.visted ? 1 : 0) // north
            }
        }

        return tiles;
    }
}

class MazeCell {
    constructor(maze, x, y) {
        this.maze = maze;
        this.x = x;
        this.y = y;
        this.northWall = true;
        this.southWall = true;
        this.eastWall = true;
        this.westWall = true;
        this.visited = false;
    }

    getNeighbors() {
        var neighbors = [
            this.maze.getCell(this.x + 0, this.y - 1, 'north'), // north
            this.maze.getCell(this.x + 0, this.y + 1, 'south'), // south
            this.maze.getCell(this.x - 1, this.y + 0, 'west'), // west
            this.maze.getCell(this.x + 1, this.y + 0, 'east'), // east
        ];

        return neighbors.where(i => i != void 0);
    }

    getUnvistedNeighbors() {
        var neighbors = this.getNeighbors();

        return neighbors.where(i => !i.visited);
    }
}