function RoomLayer(room) {
    this.room = room;
} 

// Inherit from layer.
RoomLayer.prototype = new Layer();
RoomLayer.prototype.constructor = RoomLayer;

// Update this layer.
RoomLayer.prototype.update = function (gameState) {

}

// Draw this layer.
RoomLayer.prototype.draw = function (context) {
    var image = new Image();
    image.src = "data/characters/player/player.png";
    context.drawImage(image, 100, 100);
}
