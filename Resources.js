class ResourceFactory {
    static create(data) {
        if (!data)
            return new Resource();
        
        var constructors = {
            "weapon":Weapon,
            "armor":Armor,
            "tile":Tile,
            "coin":Coin,
            "map":Map,
            "container":Container,
            "character":Character,
            "player":Player
        }

        if (constructors[data.type]) {
            return new constructors[data.type](data);
        }

        return new Resource();
    }
}




class Resource {
    constructor(data) {
        this.isType = { };
        this.isType[Resource] = true;

        if (data) this.read(data);
    }

    read(data) {
        if (!data) {
            this.setName = "Default";
            this.name = "Unnamed";
            return;
        };

        this.setName = data.setName;
        this.name = data.name;

        // Overloaded by subclasses.
    }

    getImage(path) {
        var image = new Image();
        image.src = path;

        return image;
    }
}




// Item - base class for all game items (e.g., "Weapons", "Armor", etc...).
class Item extends Resource{
    constructor(data) {
        super(data);
        this.isType[Item] = true;
    }

    read(data) {
        super.read(data);

        if (!data) {
            this.frequency = this.getFrequency();
            return
        };

        this.frequency = this.getFrequency(data.frequency);
    }

    getFrequency(frequency) {
        if (!frequency) {
            return { win: 0, find: 0, shop: 0, };
        }

        return {
            win: frequency.win || (frequency.default || 0),
            find: frequency.find || (frequency.default || 0),
            shop: frequency.shop || (frequency.default || 0),
        };
    }
}






// Equippable - an equippable item. 
class Equippable extends Item {
    constructor(data) {
        super(data);

        this.isType[Equippable] = true;
    }

    read(data) {
        super.read(data);

        if (!data) {
            this.equip = "Unknown";
            return;
        }

        this.equip = data.equip;

        this.image = this.getImage(data.image); 
        this.paperdoll = this.getImage(data.image);

        this.frequency = this.getFrequency(data.frequency);
    }

    // Read ranged statistic (i.e., stat with min and max).
    getRangedStat(stat) {
        if (!stat) return { min:0, max:0 };

        return {
            min: stat.min || 0,
            max: stat.max || 0,
        }
    }
}




// Armor - item that represents a peice of armor. 
class Armor extends Equippable {
    constructor(data) {
        super(data);

        this.isType[Armor] = true;
    }

    read(data) {
        super.read(data)

        if (!data) {
            this.defend = super.getRangedStat();
            return
        };
               
        this.defend = this.getRangedStat(data.defend);
    }
}





// Weapon - item that representts a weapon.
class Weapon extends Equippable {
    constructor(data) {
        super(data);

        this.isType[Weapon] = true;
    }

    read(data) {
        super.read(data);

        if (!data) {
            this.attack = super.getRangedStat();
            return
        };

        this.attack = this.getRangedStat(data.attack);
    }
}





class Tile extends Resource {
    constructor(data) {
        super(data);
        this.isType[Tile] = true;
    }

    read(data) {
        super.read(data);

        if (!data) {
            this.tileType = "Unknown";
            this.floors = this.getFloors();
            return;
        }

        this.tileType = data['tile-type'] || "Unknown";
        this.floors = this.getFloors(data.floors);
    }

    getFloorId() {
        return Randomizer.pickIndexWithFreq(this.floors, i => i.frequency);
    }

    getFloors(floors) {
        if (!floors)
            return [];

        var res = [];
        floors.forEach(floor => {
            if (!floor || !floor.path) return;

            res.push({
                image: this.getImage(floor.path),
                frequency: floor.freq || 0,
            })
        });

        return res;
    }
}





class Container extends Item {
    constructor(data) {
        super(data);
        this.isType[Container] = true;
    }

    read(data) {
        super.read(data)

        if (!data) return;
               
        this.image = this.getImage(data.image); 
    } 
}





class Coin extends Item {
    constructor(data) {
        super(data);
        this.isType[Coin] = true;
    }

    read(data) {
        super.read(data)

        if (!data) return;
               
        this.image = this.getImage(data.image); 
    }   
} 





class Map extends Item {
    constructor(data) {
        super(data);
        this.isType[Map] = true;
    }

    read(data) {
        super.read(data)

        if (!data) return;
               
        this.image = this.getImage(data.image); 
    }   
}