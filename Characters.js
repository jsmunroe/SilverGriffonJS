class Character extends Resource {
    constructor(data) {
        super(data);
        this.rawData = data;
        this.isType[Character] = true;
        this.x = 0;
        this.y = 0;
        this.facing = 'right';
    }

    read(data) {
        super.read(data);

        if (!data) {
            this.characteristics = this.getCharacteristics();
            this.controller = this.getController();
            return;
        }

        this.image = this.getImage(data.sprite);
        this.characteristics = this.getCharacteristics(data.characteristics);
        this.controller = this.getController(data.controller);
    }

    place(x, y) {
        this.x = x;
        this.y = y;
    }

    act(next) {
        if (!this.controller) {
            next();
        }

        this.controller.act(this, next);
    }

    create() {
        return new Character(this.rawData);
    }

    moveLeft() {
        this.x--;
        this.facing = 'left';
    }

    moveRight() {
        this.x++;
        this.facing = 'right';
    }

    moveUp() {
        this.y--;
    }

    moveDown() {
        this.y++;
    }

    getCharacteristics(characteristics) {
        if (!characteristics) {
            return {
                evade: 0,
                attack: 0,
                defend: 0,
                speed: 0
            }
        }

        return {
            evade: characteristics.evade || 0,
            attack: characteristics.attack || 0,
            defend: characteristics.defend || 0,
            speed: characteristics.speed || 0
        };
    }

    getController(controller) {
        return ControllerFactory.create(controller, this);
    }
}






class Player extends Character {
    constructor(data) {
        super(data);
        this.isType[Player] = true;
    }

    read(data) {
        super.read(data);

        if (!data) {
            return;
        }
    }

    create() {
        return new Player(this.rawData);
    }
}