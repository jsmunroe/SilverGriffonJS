class ControllerFactory {
    static create(data) {
        if (!data)
            return new Controller();

        var constructors = {

        };

        if (constructors[data.mode]) {
            return new constructors[data.mode](data);
        }

        return Controller();
    }
}




class Controller {
    constructor(data) {
        this.is = { };
        this.is[Controller] = true;

        if (!data) this.read(data);
    }

    read(data) {

    }
}




class DumbController {
    constructor(data) {
        super(data);
        this.is[DumbController] = true;
    }

    read(data) {
        if (!data) {
            this.standbyProclivity = "none";
            return;
        }

        this.standbyProclivity = data.standbyProclivity;
    }
}

