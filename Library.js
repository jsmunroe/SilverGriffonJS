function Library(path, success) {
    this.path = path;
    this.success = success;
    this.resources = [];
    
    this.read(path);
}

Library.prototype.read = function(path) {
    var self = this;

    this.resources = [];

    Library.getObject(path).done(
        function(gameData) {
            var resources = gameData.resources || [];

            resources.forEach(function(resource) {
                self.readResource(resource);
            });
        });
}

Library.prototype.readResource = function(path) {
    var self = this; 

    Library.getObject(path).done(
        function(resource) {
            if (!resource) return;

            var setName = resource.name || "None";
            var items = resource.items || [];

            items.forEach(function(itemData) {
                var item = ItemFactory.create(itemData);
                self.resources.push(item);
            });
        }
    )
}


// Get object from JSON at given path.
Library.getObject = function(path, success, error) {
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