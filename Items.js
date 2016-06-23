class ItemFactory {
    static create(itemData) {
        if (!itemData)
            return new Item();
        
        var constructors = {
            "weapon":Weapon,
            "armor":Armor,
            "tile":Tile,
            "coin":Coin,
            "map":Map,
        }

        if (constructors[itemData.type]) {
            return new constructors[itemData.type](itemData);
        }
    }
}




// Item - base class for all game items (e.g., "Weapons", "Armor", etc...).
class Item {
    constructor(itemData) {
        if (itemData) this.read(itemData);
    }

    read(itemData) {
        if (!itemData) {
            this.name = "Unnamed";
            this.frequency = this.getFrequency();
            return
        };

        this.name = itemData.name;
        this.frequency = this.getFrequency(itemData.frequency);

        // Overloaded by subclasses.
    }

    getImage(path) {
        var image = new Image();
        image.src = path;

        return image;
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
    constructor(itemData) {
        super(itemData);
    }

    read(itemData) {
        if (!itemData) {
            this.equip = "Unknown";
            return;
        }

        super.read(itemData);

        this.equip = itemData.equip;

        this.image = this.getImage(itemData.image); 
        this.paperdoll = this.getImage(itemData.image);

        this.frequency = this.getFrequency(itemData.frequency);
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
    constructor(itemData) {
        super(itemData);
    }

    read(itemData) {
        if (!itemData) {
            this.defend = super.getRangedStat();
            return
        };
               
        super.read(itemData)

        this.defend = this.getRangedStat(itemData.defend);
    }
}

// Weapon - item that representts a weapon.
class Weapon extends Equippable {
    constructor(itemData) {
        super(itemData);
    }

    read(itemData) {
        if (!itemData) {
            this.attack = super.getRangedStat();
            return
        };

        super.read(itemData);

        this.attack = this.getRangedStat(itemData.attack);
    }
}

class Tile extends Item {
    constructor(itemData) {
        super(itemData);
    }

    read(itemData) {
        if (!itemData) {
            this.tileType = "Unknown";
            this.floors = this.getFloors();
            return;
        }

        this.tileType = itemData.tileType || "Unknown";
        this.floors = this.getFloors(itemData.floors);
        
        super.read(itemData);
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
                path: floor.path,
                frequency: floor.freq || 0,
            })
        });

        return res;
    }
}

class Coin extends Item {
    constructor(itemData) {
        super(itemData);
    }

    read(itemData) {
        if (!itemData) {
            return
        };
               
        super.read(itemData)

        this.image = this.getImage(itemData.image); 
    }   
} 

class Map extends Item {
    constructor(itemData) {
        super(itemData);
    }

    read(itemData) {
        if (!itemData) {
            return
        };
               
        super.read(itemData)

        this.image = this.getImage(itemData.image); 
    }   
} 