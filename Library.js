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

    getItem(type, selector) {
        type = type || Item;
        selector = selector || (i => true);
        
        var typeName = type.name;

        return this.resources.where(i => i.is && i.is[type] && selector(i));
    }

    getItemSet(type, setName) {
        return this.getItem(type, i => i.setName === setName);
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