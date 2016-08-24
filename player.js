function Player(stage, x, y) {

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
    this.speed = 5;
};

Player.prototype.update = function(walls) {
    //check collision before moving
    var colliding = false;
    for (var i = 0; i < walls.length; i++) {
        if (collides(this.sprite, walls[i])) {
               colliding = true;
        }
    }
    if(!colliding){
        if (Key.isDown(Key.UP)) this.moveUp();
        if (Key.isDown(Key.LEFT)) this.moveLeft();
        if (Key.isDown(Key.DOWN)) this.moveDown();
        if (Key.isDown(Key.RIGHT)) this.moveRight();
    } else {
        this.sprite.position.y -= 1;
    }
};

Player.prototype.moveLeft = function() {
    this.sprite.position.x -= this.speed;
};

Player.prototype.moveRight = function() {
    this.sprite.position.x += this.speed;
};

Player.prototype.moveUp = function() {
    this.sprite.position.y -= this.speed;
};

Player.prototype.moveDown = function() {
    this.sprite.position.y += this.speed;
};
