class InputCommands {
    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }

    static get unknown() { return new InputCommands(''); }
    static get moveUp() { return new InputCommands('moveUp'); }
    static get moveDown() { return new InputCommands('moveDown'); }
    static get moveLeft() { return new InputCommands('moveLeft'); }
    static get moveRight() { return new InputCommands('moveRight'); }
    static get rest() { return new InputCommands('moveRight'); }
}

var inputService = (function($) {
    var keysConfig = {
        87: InputCommands.moveUp,       // w key
        65: InputCommands.moveLeft,     // a key  
        68: InputCommands.moveRight,    // d key
        83: InputCommands.moveDown,     // s key
        38: InputCommands.moveUp,       // up key
        37: InputCommands.moveLeft,     // left key
        39: InputCommands.moveRight,    // right key
        40: InputCommands.moveDown,     // down key
        32: InputCommands.rest,         // spacebar
    }    
    
    class InputService {
        constructor() {
            this.keyDownCallbacks = [];
            this.keyUpCallbacks = [];

            var self = this;

            $(document).keydown(function (ev) {
                var command = keysConfig[ev.which] || InputCommands.unknown;
                self.keyDownCallbacks.forEach(function (callback) {
                    callback(command);
                })
                self.keyDownCallbacks = []; // Not thread safe.

                console.log('Key down:' + command);
            });

            $(document).keyup(function (ev) {
                var command = keysConfig[ev.which] || InputCommands.unknown;
                self.keyUpCallbacks.forEach(function (callback) {
                    callback(command);
                })
                self.keyUpCallbacks = []; // Not thread safe.
            });
        }

        waitKeyDown(callback) {
            if (!callback instanceof Function) {
                return;
            }

            this.keyDownCallbacks.push(callback);
        }

        waitKeyUp(callback) {
            if (!callback instanceof Function) {
                return;
            }

            this.keyUpCallbacks.push(callback);
        }
    }

    return new InputService();
})(jQuery);