class Player {
    constructor(stage, x, y) {

        //add stage
        this.stage = stage;

        //create sprite from player texture
        this.sprites = {
            front: new PIXI.Sprite(PIXI.loader.resources.blockyFront.texture),
            left: new PIXI.Sprite(PIXI.loader.resources.blockyLeft.texture),
            right: new PIXI.Sprite(PIXI.loader.resources.blockyRight.texture),
            slideLeft1: new PIXI.Sprite(PIXI.loader.resources.blockySlideLeft1.texture),
            slideLeft2: new PIXI.Sprite(PIXI.loader.resources.blockySlideLeft2.texture),
            slideRight1: new PIXI.Sprite(PIXI.loader.resources.blockySlideRight1.texture),
            slideRight2: new PIXI.Sprite(PIXI.loader.resources.blockySlideRight2.texture),

        }

        this.switchToSprite(this.sprites.right, x, y);

        //movement speed
        this.movementVector = {
            x: 0,
            y: 0
        };

        this.faceDirection = "right";
        this.contactGroundEvent = false;
        this.isInAir = true;
        this.hasDoubleJumped = false;

        var up = keyboard(38);

        up.press = () => {
            if(!this.isInAir){
                console.log(10);
                this.movementVector.y = -10;
            }
            if(this.isInAir && !this.hasDoubleJumped){
                this.hasDoubleJumped = true;
                this.movementVector.y = -10;
            }
        };

    }

    switchToSprite (sprite, x, y) {
        if(this.sprite !== sprite){
            if(this.sprite){
                this.removeSprite();
            }
            this.setupSprite(sprite, x, y);
            this.sprite = sprite;
        }
    }

    removeSprite () {
        this.stage.removeChild(this.sprite);
    }

    setupSprite (sprite, x, y) {
        // center the sprite's anchor point
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        // set position
        sprite.position.x = x;
        sprite.position.y = y;
        // set size
        sprite.width = 64;
        sprite.height = 64;
        // add sprite to stage
        this.stage.addChild(sprite);

    }

    applyMovementVector() {
        this.sprite.position.x += this.movementVector.x;
        this.sprite.position.y += this.movementVector.y;
    }

    applyGravity() {
        this.movementVector.y = Math.min(this.movementVector.y + 0.5, 10);
    }

    entschleunigen() {
        if(this.movementVector.x > 0){
            this.movementVector.x = Math.max(this.movementVector.x - 0.25, 0);
            if(!this.isInAir){
                if(Math.abs(this.movementVector.x) > 3.95){
                    this.switchToSprite(this.sprites.slideRight1, this.sprite.position.x, this.sprite.position.y);
                } else {
                    this.switchToSprite(this.sprites.slideRight2, this.sprite.position.x, this.sprite.position.y);
                }
            }
        } else if(this.movementVector.x < 0){
            this.movementVector.x = Math.min(this.movementVector.x + 0.25, 0);
            if(!this.isInAir){
                if(Math.abs(this.movementVector.x) > 3.95){
                    this.switchToSprite(this.sprites.slideLeft1, this.sprite.position.x, this.sprite.position.y);
                } else {
                    this.switchToSprite(this.sprites.slideLeft2, this.sprite.position.x, this.sprite.position.y);
                }
            }
        } else {
               if(this.faceDirection == "right"){
                   this.switchToSprite(this.sprites.right, this.sprite.position.x, this.sprite.position.y);
               }
               if(this.faceDirection == "left"){
                   this.switchToSprite(this.sprites.left, this.sprite.position.x, this.sprite.position.y);
               }

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
        this.contactGroundEvent = false;
        this.isInAir = true;
    } else if(!this.contactGroundEvent){
        this.movementVector.y = 0;
        this.contactGroundEvent = true;
        this.isInAir = false;
        this.hasDoubleJumped = false;
    }

    if (Key.isDown(Key.LEFT)) {
        this.movementVector.x = Math.min(Math.max(this.movementVector.x - 0.35, -5),2);
        this.faceDirection = "left";
        this.switchToSprite(this.sprites.left, this.sprite.position.x, this.sprite.position.y);
    }
    else if (Key.isDown(Key.RIGHT)) {
        this.movementVector.x = Math.max(Math.min(this.movementVector.x + 0.35, 5),-2);
        this.faceDirection = "right";
        this.switchToSprite(this.sprites.right, this.sprite.position.x, this.sprite.position.y);
    } else {
        this.entschleunigen();
    }
    this.applyMovementVector();

    // if(this.movementVector.x > 0){
    //     this.switchToSprite(this.sprites.right, this.sprite.position.x, this.sprite.position.y);
    // }
    //
    // if(this.movementVector.x < 0){
    //     this.switchToSprite(this.sprites.left, this.sprite.position.x, this.sprite.position.y);
    // }
};
