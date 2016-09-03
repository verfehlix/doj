class MovementVector {
    constructor(){
        this.x=0;
        this.y=0;
        this.timeDelta = 1;
    }
    deltaX(val){
        this.x += val * this.timeDelta
        return this.x
    }
    deltaY(val){
        this.y += val * this.timeDelta
        return this.y
    }
}

class Player {
    constructor(stage, x, y) {

        this.stage = stage;

        this.graphics = new PIXI.Graphics();
        this.stage.addChildAt(this.graphics, 11);

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

        this.movementVector = new MovementVector();

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
                        this.movementVector.x = -35;
                        this.movementVector.y = 0;
                        break;
                    case "right":
                        this.movementVector.x = +35;
                        this.movementVector.y = 0;
                        break;

                }
                var that = this;
                setTimeout(() => {that.stopDash()}, 150);
            }
        };

    }

    stopDash () {
        this.isDashing = false;
        this.movementVector.x = 0;
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
        this.stage.addChildAt(sprite,10);
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

    applyMovementVector(delta) {
        this.sprite.position.x += (this.movementVector.x * delta);
        this.sprite.position.y += (this.movementVector.y * delta);
    }

    applyGravity() {
        this.movementVector.y = Math.min(this.movementVector.deltaY(0.5), 10);
    }

    entschleunigen() {
        if(this.movementVector.x > 0){
            this.movementVector.x = Math.max(this.movementVector.deltaX(-0.25), 0);
            if(!this.isInAir){
                if(Math.abs(this.movementVector.x) > 3.95){
                    this.switchToSprite(this.sprites.slideRight1, this.sprite.position.x, this.sprite.position.y);
                } else {
                    this.switchToSprite(this.sprites.slideRight2, this.sprite.position.x, this.sprite.position.y);
                }
            }
        } else if(this.movementVector.x < 0){
            this.movementVector.x = Math.min(this.movementVector.deltaX(+0.35), 0);
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

Player.prototype.update = function(walls, delta) {

    this.movementVector.timeDelta = delta;
    //check collision before moving
    var bottomColliding = false;
    var bottomBoundingBox = {
        x: this.sprite.x - this.sprite.width/2,
        y: this.sprite.y + this.sprite.height/2 -10,
        width: this.sprite.width,
        height: 10
    };

    this.graphics.clear();
    this.graphics.beginFill(0xf200ff);
    this.graphics.drawRect(bottomBoundingBox.x, bottomBoundingBox.y, bottomBoundingBox.width, bottomBoundingBox.height);

    for (var i = 0; i < walls.length; i++) {
        if (collides(bottomBoundingBox, walls[i])) {
               bottomColliding = true;
        }
    }

    if(!bottomColliding){
        if(!this.isDashing){
            this.applyGravity(delta);
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
            this.movementVector.x = Math.min(Math.max(this.movementVector.deltaX(-0.35), -5),2);
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
            this.movementVector.x = Math.max(Math.min(this.movementVector.deltaX(+0.35), 5),-2);
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

    this.applyMovementVector(delta);


};
