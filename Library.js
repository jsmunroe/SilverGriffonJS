(function ($) {
    class Library {
        init (path, success) {
            this.path = path;
            this.success = success;
            this.resources = [];
            
            this.read();
        }

        read() {
            var self = this;

            this.resources = [];

            this.getObject(this.path).done(
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

            this.getObject(current).done(
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

            return this.resources.where(i => i.isType && i.isType[type] && selector(i));
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

        pickRandomCharacters(setName, options) {
            var actual = _.defaults(options || {}, {
                min: 1,
                max: 5
            });

            var characterTypes = this.getResources(Character, i => i.setName.equalsNoCase(setName) && !i.isType[Player])

            var characterCount = Randomizer.nextInt(actual.min, actual.max);
            var characters = new Array(characterCount);

            for (var i = 0; i < characterCount; i++) {
                var characterType = Randomizer.pick(characterTypes);
                var character = characterType.create();
                characters[i] = character;
            }

            return characters;
        }

        getPlayerCharacter(options) {
            var actual = _.defaults(options || {}, {
            });

            var player = this.getResources(Player).first();

            return player;
        }

        // Get object from JSON at given path.
        getObject(path, success, error) {
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

    TypeContainer.register(GameTypes.library, () => new Library());
})(jQuery);




class TileSetFactory {
    constructor(setName) {
        this.setName = setName;
    } 

    create() {
        if (!this.tileSet) {
            this.tileSet = GameAssets.library.getTileSet(this.setName);
        }

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