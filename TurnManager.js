(function($){
    class TurnManager {
        constructor() {
            this.characters = [];
        }

        add(character) {
            // TODO: Make sure character is not already in the manager.
            this.characters.push(character);
        }

        step(next) {
            if (!this.characters.length) { 
                return next();
            }

            var character = this.characters.shift();
            character.act(next);
            this.characters.push(character);
        }
    }

    TypeContainer.register(GameTypes.turnManager, () => new TurnManager());
})(jQuery);
