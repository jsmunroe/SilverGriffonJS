class InputCommands {
    static get unknown() { return ''; }
    static get moveUp() { return 'moveUp'; }
    static get moveDown() { return'moveDown'; }
    static get moveLeft() { return 'moveLeft'; }
    static get moveRight() { return 'moveRight'; }
    static get rest() { return 'moveRight'; }
}

(function($) {
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
                var keyDownCallbacks = self.keyDownCallbacks;
                self.keyDownCallbacks = [];
                keyDownCallbacks.forEach(function (callback) {
                    callback(command);
                })

                console.log('Key down:' + command);
            });

            $(document).keyup(function (ev) {
                var command = keysConfig[ev.which] || InputCommands.unknown;
                var keyUpCallbacks = self.keyUpCallbacks;
                self.keyUpCallbacks = [];
                keyUpCallbacks.forEach(function (callback) {
                    callback(command);
                })

                console.log('Key up:' + command);
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

    TypeContainer.register(GameTypes.inputService, () => new InputService());
})(jQuery);