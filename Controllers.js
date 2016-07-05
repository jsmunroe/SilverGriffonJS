class ControllerFactory {
    static create(data) {
        if (!data)
            return new Controller();

        var constructors = {
            input: InputController,
            dumb: DumbController
        };

        if (constructors[data.mode]) {
            return new constructors[data.mode](data);
        }

        return new Controller();
    }
}





class Controller {
    constructor(data) {
        this.isType = { };
        this.isType[Controller] = true;

        if (!data) this.read(data);
    }

    read(data) {

    }

    act(character, next) {
        next();
    }
}




class DumbController extends Controller {
    constructor(data) {
        super(data);
        this.isType[DumbController] = true;
    }

    read(data) {
        if (!data) {
            this.standbyProclivity = "none";
            return;
        }

        this.standbyProclivity = data.standbyProclivity;
    }

    act(character, next) {
        var enemy = this.enemyInSight(character)
        
        if (enemy) {

        } else {
            this.standby(character, next);
        }
    }

    enemyInSight(character) {
        return void 0;
    }

    standBy(character, next) {
        if (this.standbyProclivity == 'wander') {
            this.wander(character, next);
        }
        else {
            this.wait(character, next);
        }        
    }

    wander(character, next) {
        character.x++;
        next();
    }

    wait(character, next) {
        return next();
    }

    shouldFight(character, enemy) {
        return true;
    }

    shouldFlee(character, enemy) {
        return true;
    }

    engage(character, target, next) {
        if (this.shouldFight(character, enemy)) {
            this.fight(character, enemy, next);
        } else {
            this.flee(character, enemy, next);
        }
    }

    attack(character, target, next) {
        return next();
    }

    flee(character, target, next) {
        return next();
    }
}




class InputController extends Controller {
    constructor(data) {
        super(data);
        this.isType[InputController] = true;
    }

    read(data) {
        if (!data) {
            return;
        }
    }

    act(character, next) {
        GameAssets.inputService.waitKeyUp(key => {
            if (key == InputCommands.moveUp.name) {
                character.y--;
                next();
            } else if (key == InputCommands.moveDown.name) {
                character.y++;
                next();
            } else if (key == InputCommands.moveLeft.name) {
                character.x--;
                next();
            } else if (key == InputCommands.moveRight.name) {
                character.x++;
                next();
            } else {
                this.act(character, next);
            }
        });
    }}

