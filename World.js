const roomWidth = 15;
const roomHeight = 15;

(function($) {
    class World {
        constructor(options) {
            this.tileSetFactory = options.tileSetFactory;
            this.roomBuilderFactory = options.roomBuilderFactory;
            this.currentX = options.currentX || 0;
            this.currentY = options.currentY || 0;
            this.rooms = {};
        }

        // Get room a x and y coordinates.
        room(x, y) {
            var room = this.rooms[x+":"+y]
            if (!room) {
                room = this.buildRoom();
                this.rooms[x+":"+y] = room;
            }
                
            return room;       
        }

        get currentRoom ()  { return this.room(this.currentX, this.currentY); }

        // Build and return a room.
        buildRoom() {
            var builder = this.roomBuilderFactory.create();
            var tileSet = this.tileSetFactory.create();

            var room = builder.build({
                width: roomWidth,
                height: roomHeight,
                tileSet: tileSet,
            });

            return room;
        }
    }

    TypeContainer.register(GameTypes.world, () => 
        new World({
            tileSetFactory: new TileSetFactory("Stone"), 
            roomBuilderFactory: new RandomRoomBuilderFactory()}
        )
    );
})(jQuery);



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

        this.characters = [];

        this.width = actual.width;
        this.height = actual.height;
        this.tileSet = actual.tileSet;
        this.tiles = actual.tiles;
    }

    placeCharacter(character, randomize = true) {
        if (randomize) {
            var tile = this.pickPlaceableTile();
            character.x = tile.x;
            character.y = tile.y;
        }

        this.characters.push(character);
    }

    placeCharacters(characters, randomize = true) {
        characters.forEach(i => this.placeCharacter(i, randomize));
    }

    getPlaceableTiles() {
        var tiles = [];

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var tile = this.tiles[y * this.width + x];
                var characters = this.characters.where(i => i.x == x && i.y == y);
                if (tile.tileType != 'wall' && characters.length <= 0) {
                    tiles.push(tile);
                }
            }
        }

        return tiles;
    }

    pickPlaceableTile() {
        var placeableTiles = this.getPlaceableTiles();
        var tile = Randomizer.pick(placeableTiles);
        return tile;
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

    getTileInfo(x, y) {
        return this.tiles[y * this.width + x];
    }

    getTilePassible(x, y) {
        var tileInfo = this.tiles[y * this.width + x];

        if (!tileInfo)
            return false;
        
        var tileType = tileInfo.tileType;

        return tileType != 'wall'
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
                var tile;
                if (x == 0 || y == 0 || x == actual.width - 1 || y == actual.height - 1) {
                    tile = this.pickTile(actual.tileSet, "wall");
                } else {
                    tile = this.pickTile(actual.tileSet, "floor");
                }

                tile.x = x; 
                tile.y = y;
                tile.isSeen = false;
                tile.isVisible = false;
                tiles[y * actual.width + x] = tile;
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
                var tile;

                if (mazeTiles[y * actual.width + x] == 1) {
                    tile = this.pickTile(actual.tileSet, "wall");
                } else {
                    tile = this.pickTile(actual.tileSet, "floor");
                }

                tile.x = x; 
                tile.y = y;
                tile.isSeen = false;
                tile.isVisible = false;
                tiles[y * actual.width + x] = tile;
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
        var currentX = Randomizer.nextInt(this.width);
        var currentY = Randomizer.nextInt(this.height);
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






class ShadowCaster {
    constructor(room) {
        this.room = room;
    }

    clear() {
        for (var y = 0; y < this.room.height; y++) {
            for (var x = 0; x < this.room.width; x++) {
                var tileInfo = this.room.getTileInfo(x, y);
                if (tileInfo) {
                    tileInfo.isVisible = false;
                }
            }
        }
    }

    isOpaque(x, y) {
        return !this.room.getTilePassible(x, y);
    }

    setFov(x, y) {
        var tileInfo = this.room.getTileInfo(x, y);
        if (tileInfo) {
            tileInfo.isVisible = true;
            tileInfo.isSeen = true;
        }
    }

    cast(x, y, radius) {
        this.clear();
        var self = this;

        var opaque = this.translateOrigin((x, y) => self.isOpaque(x, y), x, y);
        var fov = this.translateOrigin((x, y) => self.setFov(x, y), x, y);

        for (var octant = 0; octant < 8; ++octant) {
            this.castInOctantZero(
                this.translateOctant(opaque, octant),
                this.translateOctant(fov, octant),
                radius
            );
        }
    }

    castInOctantZero(isOpaque, setFov, radius) {
        var queue = new Queue();
        queue.enqueue({ x: 0, bottom: { x: 1, y: 0 }, top: {x: 1, y: 1} });
        while (queue.getLength() > 0) {
            var current = queue.dequeue();
            if (current.x > radius)
                continue;

            this.computerFovForColumnPortion(current.x, current.top, current.bottom, isOpaque, setFov, radius, queue);
        }
    }

    // This method has two main purposes: (1) it marks points inside the
    // portion that are within the radius as in the field of view, and 
    // (2) it computes which portions of the following column are in the 
    // field of view, and puts them on a work queue for later processing. 
    computerFovForColumnPortion(x, top, bottom, isOpaque, setFov, radius, queue) {
        // Search for transitions from opaque to transparent or
        // transparent to opaque and use those to determine what
        // portions of the *next* column are visible from the origin.

        // Start at the top of the column portion and work down.
        var topY;
        if (x === 0) {
            topY = 0;
        }
        else {
            var quotient = Math.floor((2 * x + 1) * top.y / (2 * top.x));
            var remander = (2 * x + 1) * top.y % (2 * top.x);

            if (remander > top.x) {
                topY = quotient + 1;
            } else {
                topY = quotient;
            }
        }

        // Note that this can find a top cell that is actually entirely blocked by
        // the cell below it; consider detecting and eliminating that.

        var bottomY;
        if (x == 0) {
            bottomY = 0;
        } else {
            var quotient = Math.floor((2 * x - 1) * bottom.y / (2 * bottom.x));
            var remainder = (2 * x - 1) * bottom.y % (2 * bottom.x);

            if (remainder >= bottom.x)
                bottomY = quotient + 1;
            else
                bottomY = quotient;
        }

        // A more sophisticated algorithm would say that a cell is visible if there is 
        // *any* straight line segment that passes through *any* portion of the origin cell
        // and any portion of the target cell, passing through only transparent cells
        // along the way. This is the "Permissive Field Of View" algorithm, and it
        // is much harder to implement.

        var wasLastCellOpaque = null;
        for (var y = topY; y >= bottomY; --y) {
            var inRadius = this.isInRadius(x, y, radius);
            if (inRadius) {
                // The current cell is in the field of view.
                setFov(x,y);
            }

            // A cell that was too far away to be seen is effectively
            // an opaque cell; nothing "above" it is going to be visible
            // in the next column, so we might as well treat it as 
            // an opaque cell and not scan the cells that are also too
            // far away in the next column.

            var currentIsOpaque = !inRadius || isOpaque(x, y);
            if (wasLastCellOpaque != null) {
                if (currentIsOpaque) {
                    // We've found a boundary from transparent to opaque. Make a note
                    // of it and revisit it later.
                    if (!wasLastCellOpaque) {
                        // The new bottom vector touches the upper left corner of 
                        // opaque cell that is below the transparent cell.
                        queue.enqueue({ x: x + 1, bottom: { x: x * 2 - 1, y: y * 2 + 1 }, top: top });
                    }
                }
                if (wasLastCellOpaque) {
                    // We've found a boundary from opaque to transparent. Adjust the
                    // top vector so that when we find the next boundary or do
                    // the bottom cell, we have the right top vector.
                    //
                    // The new top vector touches the lower right corner of the 
                    // opaque cell that is above the transparent cell, which is
                    // the upper right corner of the current transparent cell.
                    top = { x: x * 2 + 1, y: y * 2 + 1 }
                }
            }
            wasLastCellOpaque = currentIsOpaque;
        }

        // Make a note of the lowest opaque-->transparent transition, if there is one. 
        if (wasLastCellOpaque != null && !wasLastCellOpaque) {
            queue.enqueue({ x: x + 1, bottom: bottom, top: top });
        }
    }

    // Is the lower-left corner of cell (x,y) within the radius?
    isInRadius(x, y, length) {
        return (2 * x - 1) * (2 * x - 1) + (2 * y - 1)  * (2 * y - 1) <= 4 * length * length;
    }

    // Octant helpers
    //
    //
    //                 \2|1/
    //                 3\|/0
    //               ----+----
    //                 4/|\7
    //                 /5|6\
    //
    // 

    translateOrigin(f, x, y) {
        return (a, b) => f(a + x, b + y);
    }

    translateOctant(f, octant) {
        if (octant === 1) return (x, y) => f(y, x);
        else if (octant === 2) return (x, y) => f(-y, x);
        else if (octant === 3) return (x, y) => f(-x, y);
        else if (octant === 4) return (x, y) => f(-x, -y);
        else if (octant === 5) return (x, y) => f(-y, -x);
        else if (octant === 6) return (x, y) => f(y, -x);
        else if (octant === 7) return (x, y) => f(x, -y);
        else return f;
    }

}