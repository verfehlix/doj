class Player {
    constructor(stage, x, y) {

        this.stage = stage;

        this.sprites = {
            front: new PIXI.Sprite(PIXI.loader.resources.blockyFront.texture),
            left: new PIXI.Sprite(PIXI.loader.resources.blockyLeft.texture),
            right: new PIXI.Sprite(PIXI.loader.resources.blockyRight.texture),
            jumpLeft: new PIXI.Sprite(PIXI.loader.resources.blockyJumpLeft.texture),
            jumpRight: new PIXI.Sprite(PIXI.loader.resources.blockyJumpRight.texture),
            slideLeft1: new PIXI.Sprite(PIXI.loader.resources.blockySlideLeft1.texture),
            slideLeft2: new PIXI.Sprite(PIXI.loader.resources.blockySlideLeft2.texture),
            slideRight1: new PIXI.Sprite(PIXI.loader.resources.blockySlideRight1.texture),
            slideRight2: new PIXI.Sprite(PIXI.loader.resources.blockySlideRight2.texture),
            moveLeft: this.setupMovie('blocky_walkleft_', x, y),
            moveRight: this.setupMovie('blocky_walkright_', x, y)
        }

        this.switchToSprite(this.sprites.right, x, y);

        this.movementVector = {
            x: 0,
            y: 0
        };

        this.faceDirection = "right";
        this.contactGroundEvent = false;
        this.isInAir = true;
        this.hasDoubleJumped = false;
        this.isDashing = false;

        var up = keyboard(38);
        up.press = () => {
            if(!this.isInAir){
                this.movementVector.y = -10;
            }
            if(this.isInAir && !this.hasDoubleJumped){
                this.hasDoubleJumped = true;
                this.movementVector.y = -10;
            }
        };

        var space = keyboard(32);
        space.press = () => {
            if(!this.isDashing){
                this.isDashing = true;
                switch (this.faceDirection)  {
                    case "left" :
                        this.movementVector.x = -20;
                        this.movementVector.y = 0;
                        break;
                    case "right":
                        this.movementVector.x = +20;
                        this.movementVector.y = 0;
                        break;

                }
                var that = this;
                setTimeout(() => {that.disableDashing()}, 500);
            }
        };

    }

    disableDashing () {
        this.isDashing = false;
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
        //sprite.width = 64;
        //sprite.height = 64;
        // add sprite to stage
        this.stage.addChild(sprite);
    }

    setupMovie (baseString, x, y){

        var frames = [];

        for (var i = 1; i <= 3; i++) {

            var val = i < 10 ? '0' + i : i;

            frames.push(PIXI.Texture.fromFrame(baseString + val + '.png'));

        }

        var movie = new PIXI.extras.MovieClip(frames);
        movie.animationSpeed = 0.15
        movie.play();

        return movie;
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
        if(!this.isDashing){
            this.applyGravity();
        }
        this.contactGroundEvent = false;
        this.isInAir = true;
    } else if(!this.contactGroundEvent){
        this.movementVector.y = 0;
        this.contactGroundEvent = true;
        this.isInAir = false;
        this.hasDoubleJumped = false;
    }

    if (Key.isDown(Key.LEFT)) {
        if(!this.isDashing){
            this.movementVector.x = Math.min(Math.max(this.movementVector.x - 0.35, -5),2);
        }
        this.faceDirection = "left";
        if(!this.isInAir){
            this.switchToSprite(this.sprites.moveLeft, this.sprite.position.x, this.sprite.position.y);
        } else {
            this.switchToSprite(this.sprites.jumpLeft, this.sprite.position.x, this.sprite.position.y);
        }
    }
    else if (Key.isDown(Key.RIGHT)) {
        if(!this.isDashing){
            this.movementVector.x = Math.max(Math.min(this.movementVector.x + 0.35, 5),-2);
        }
        this.faceDirection = "right";
        if(!this.isInAir){
            this.switchToSprite(this.sprites.moveRight, this.sprite.position.x, this.sprite.position.y);
        } else {
            this.switchToSprite(this.sprites.jumpRight, this.sprite.position.x, this.sprite.position.y);
        }
    } else {
        this.entschleunigen();
    }

    this.applyMovementVector();
};
