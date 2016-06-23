class World {
    static get room() {

    }
}

class Room {
    constructor(options) {
        var actual = _.defaults(options || {}, {
            width: 9,
            height: 9,
            tiles: []
        });
    }
}

// Builds a rectangular room.
class RoomBuilder {
    build(options) {
        var actual = _.defaults(options || {}, {
            width: 9,
            height: 9,
            tileGroup: "Stone",
            exits: {},
            
        });
    }
}

// Builds a rectangular room with a maze in it.
class MazeRoomBuilder extends RoomBuilder {

}