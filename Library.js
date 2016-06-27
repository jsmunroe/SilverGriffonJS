class Library {
    constructor (path, success) {
        this.path = path;
        this.success = success;
        this.resources = [];
        
        this.read();
    }

    read() {
        var self = this;

        this.resources = [];

        Library.getObject(this.path).done(
            function(gameData) {
                var resources = gameData.resources || [];

                var current = resources.pop();
                if (current) {
                    self.readResource(current, resources, () => self.raiseSuccess()); 
                }
                else {
                    this.raiseSuccess();
                }
            });
    }

    readResource(current, resources, next) {
        var self = this; 

        Library.getObject(current).done(
            function(resource) {
                if (!resource) return;

                var setName = resource.name || "None";
                var items = resource.items || [];

                items.forEach(function(itemData) {
                    itemData.setName = setName;
                    var item = ResourceFactory.create(itemData);
                    if (item) {
                        self.resources.push(item);
                    }
                });
                
                current = resources.pop();
                if (current) {
                    self.readResource(current, resources, next); 
                }
                else {
                    next();
                }
            }
        )
    }

    raiseSuccess() {
        if (this.success instanceof Function) 
            this.success();
    }

    getResources(type, selector) {
        type = type || Item;
        selector = selector || (i => true);
        
        var typeName = type.name;

        return this.resources.where(i => i.is && i.is[type] && selector(i));
    }

    getTileSet(setName) {
        var tiles = this.getResources(Tile, i => i.setName.equalsNoCase(setName));

        var tileSet = {
            wall: tiles.first(i => i.tileType == "Wall"),
            floor: tiles.first(i => i.tileType == "Floor"),
            downStair: tiles.first(i => i.tileType == "DownStair"),
            upStair: tiles.first(i => i.tileType == "UpStair")
        };
        
        return tileSet;
    }

    // Get object from JSON at given path.
    static getObject(path, success, error) {
        return $.ajax({
                    cache: false,
                    url: path,
                    dataType: "json",
                    success: success,
                    error: function(xhr, textStatus, errorThrown) { 
                        log.error('Could not get object @ "' + path + '": textStatus="' + textStatus + '", errorThrown="' + errorThrown);
                    }
                });
    }
}




class TileSetFactory {
    constructor(library, setName) {
        this.tileSet = library.getTileSet(setName);
    } 

    create() {
        return this.tileSet;
    }
}




class RandomTileSetFactory {
    constructor(library, setNames) {
        this.library = library;
        this.setNames = setNames;
    }

    create() {
        var setName = Randomizer.pick(this.setNames);
        var tileSet = this.library.getTileSet(setName);
    }
}