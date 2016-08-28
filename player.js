class Player {
    constructor(stage, x, y) {

        //add stage
        this.stage = stage;

        //create sprite from player texture
        this.sprite = new PIXI.Sprite(PIXI.loader.resources.blockyFront.texture);
        // center the sprite's anchor point
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        // set position
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        // set size
        this.sprite.width = 64;
        this.sprite.height = 64;
        // add sprite to stage
        this.stage.addChild(this.sprite);

        //movement speed
        this.movementVector = {
            x: 0,
            y: 0
        };
    }

    applyMovementVector() {
        this.sprite.position.x += this.movementVector.x;
        this.sprite.position.y += this.movementVector.y;
    }

    applyGravity() {
        this.movementVector.y = Math.min(this.movementVector.y + 0.05, 5);
    }

    entschleunigen() {
        if(this.movementVector.x > 0){
            this.movementVector.x = Math.max(this.movementVector.x - 0.25, 0);
        }
        if(this.movementVector.x < 0){
            this.movementVector.x = Math.min(this.movementVector.x + 0.25, 0);
        }
    }
}

Player.prototype.update = function(walls) {
    //check collision before moving
    var bottomColliding = false;
    var bottomBoundingBox = {
        x: this.sprite.x,
        y: this.sprite.y,
        width: this.sprite.width,
        height: this.sprite.height/2
    };
    for (var i = 0; i < walls.length; i++) {
        if (collides(bottomBoundingBox, walls[i])) {
               bottomColliding = true;
        }
    }

    if(!bottomColliding){
        this.applyGravity();
    } else {
        this.movementVector.y = 0;
    }

    if (Key.isDown(Key.LEFT)) {
        this.movementVector.x = Math.max(this.movementVector.x - 0.35, -5);
    }
    else if (Key.isDown(Key.RIGHT)) {
        this.movementVector.x = Math.min(this.movementVector.x + 0.35, 5);
    } else {
        this.entschleunigen();
    }
    if (Key.isDown(Key.UP)){
        this.movementVector.y = -1;
    }

    this.applyMovementVector();

};
