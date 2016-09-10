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

        this.enduranceText = new PIXI.Text(
            "Endurance: " + this.endurance,
            {
                font:"20px pixelmix"
            }
        );

        this.enduranceText.position.x = 75;
        this.enduranceText.position.y = 5;
        this.stage.addChild(this.enduranceText);

        this.graphics = new PIXI.Graphics();
        this.stage.addChildAt(this.graphics, 11);

        this.graphics.clear();
        this.graphics.beginFill(0x73d73d);
        this.graphics.drawRect(75, 30, 191, 20);


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
            moveLeft: this.setupMovie('walkleft_', x, y),
            moveRight: this.setupMovie('walkright_', x, y)
        }

        this.switchToSprite(this.sprites.right, x, y);

        this.rightDashEmitter = new PIXI.particles.Emitter(
            this.stage,
            [PIXI.loader.resources.blockyRight.texture],
            {
            	alpha: {
            		start: 0.5,
            		end: 0
            	},
            	scale: {
            		start: 1,
            		end: 1,
            		minimumScaleMultiplier: 1
            	},
            	color: {
            		start: "#ffffff",
            		end: "#ffffff"
            	},
            	speed: {
            		start: 0,
            		end: 0
            	},
            	acceleration: {
            		x: 0,
            		y: 0
            	},
            	startRotation: {
            		min: 0,
            		max: 0
            	},
            	noRotation: false,
            	rotationSpeed: {
            		min: 0,
            		max: 0
            	},
            	lifetime: {
            		min: 5,
            		max: 5
            	},
            	blendMode: "normal",
            	frequency:  1,
            	emitterLifetime: -1,
            	maxParticles: 100,
            	pos: {
            		x: x,
            		y: y
            	},
            	addAtBack: false,
            	spawnType: "point"
            }
        );
        this.rightDashEmitter.emit = false;

        this.leftDashEmitter = new PIXI.particles.Emitter(
            this.stage,
            [PIXI.loader.resources.blockyLeft.texture],
            {
                alpha: {
                    start: 0.5,
                    end: 0
                },
                scale: {
                    start: 1,
                    end: 1,
                    minimumScaleMultiplier: 1
                },
                color: {
                    start: "#ffffff",
                    end: "#ffffff"
                },
                speed: {
                    start: 0,
                    end: 0
                },
                acceleration: {
                    x: 0,
                    y: 0
                },
                startRotation: {
                    min: 0,
                    max: 0
                },
                noRotation: false,
                rotationSpeed: {
                    min: 0,
                    max: 0
                },
                lifetime: {
                    min: 5,
                    max: 5
                },
                blendMode: "normal",
                frequency:  1,
                emitterLifetime: -1,
                maxParticles: 100,
                pos: {
                    x: x,
                    y: y
                },
                addAtBack: false,
                spawnType: "point"
            }
        );
        this.leftDashEmitter.emit = false;

        this.movementVector = new MovementVector();

        this.endurance = 100;

        this.faceDirection = "right";
        this.contactGroundEvent = false;
        this.isInAir = true;
        this.hasDoubleJumped = false;
        this.isDashing = false;
        this.isOnWall = false;
        this.hasWallJumped = false;

        var up = keyboard(38);
        up.press = () => {
            if(this.isOnWall && !this.hasWallJumped && this.isInAir){
                this.isWallJumping = true;
                this.hasWallJumped = true;
                this.movementVector.y = -15;
                if(this.faceDirection === "left"){
                    this.movementVector.x = 8;
                    this.faceDirection = "right";
                    this.switchToSprite(this.sprites.jumpRight, this.sprite.position.x, this.sprite.position.y);
                } else if(this.faceDirection === "right"){
                    this.movementVector.x = -8;
                    this.faceDirection = "left";
                    this.switchToSprite(this.sprites.jumpLeft, this.sprite.position.x, this.sprite.position.y);
                }
                var that = this;
                setTimeout(() => {that.stopWalljump()}, 350);
            } else if (this.isInAir && !this.hasDoubleJumped){
                this.hasDoubleJumped = true;
                this.movementVector.y = -10;
            } else if(!this.isInAir){
                this.movementVector.y = -10;
            }
        };

        var space = keyboard(32);
        space.press = () => {
            if(!this.isDashing && this.endurance >= 50){
                this.isDashing = true;
                this.endurance -= 50;
                switch (this.faceDirection)  {
                    case "left" :
                        this.leftDashEmitter.emit = true;
                        this.movementVector.x = -35;
                        this.movementVector.y = 0;
                        break;
                    case "right":
                        this.rightDashEmitter.emit = true;
                        this.movementVector.x = +35;
                        this.movementVector.y = 0;
                        break;

                }
                var that = this;
                setTimeout(() => {that.stopDash()}, 150);
            }
        };

        var that = this;
        setInterval(() => {that.regenerateEndurance()}, 35);
    }

    stopDash () {
        this.isDashing = false;
        this.rightDashEmitter.emit = false;
        this.leftDashEmitter.emit = false;
        this.movementVector.x = 0;
    }

    regenerateEndurance () {
        this.endurance = Math.min(100, this.endurance + 1);
    }

    stopWalljump () {
        this.isWallJumping = false;
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

Player.prototype.update = function(grounds, walls, delta) {

    this.rightDashEmitter.updateSpawnPos(this.sprite.x, this.sprite.y);
    this.rightDashEmitter.update(delta);

    this.leftDashEmitter.updateSpawnPos(this.sprite.x, this.sprite.y);
    this.leftDashEmitter.update(delta);

    this.enduranceText.text = "Endurance: " + this.endurance;

    this.graphics.clear();
    if(this.endurance < 50){
        this.graphics.beginFill(0xfa0e3f);
    } else if(this.endurance >= 50 && this.endurance < 100){
        this.graphics.beginFill(0xe8ad3b);
    } else if(this.endurance === 100){
        this.graphics.beginFill(0x73d73d);
    }

    this.graphics.drawRect(75, 30, this.endurance * 1.91, 20);

    this.movementVector.timeDelta = delta;
    //check collision before moving
    var bottomColliding = false;
    var leftColliding = false;
    var rightColliding = false;

    var bottomBoundingBox = {
        x: this.sprite.x - this.sprite.width/2,
        y: this.sprite.y + this.sprite.height/2 -10,
        width: this.sprite.width,
        height: 10
    };

    var rightBoundingBox = {
        x: this.sprite.x + this.sprite.width / 2 - 12,
        y: this.sprite.y - this.sprite.height / 2,
        width: 10,
        height: this.sprite.height
    };

    var leftBoundingBox = {
        x: this.sprite.x - this.sprite.width / 2 + 2,
        y: this.sprite.y - this.sprite.height / 2,
        width: 10,
        height: this.sprite.height
    };

    var debug = false;
    if(debug){
        this.graphics.clear();
        this.graphics.beginFill(0xf200ff);
        this.graphics.drawRect(rightBoundingBox.x, rightBoundingBox.y, rightBoundingBox.width, rightBoundingBox.height);
        this.graphics.drawRect(leftBoundingBox.x, leftBoundingBox.y, leftBoundingBox.width, leftBoundingBox.height);
        this.graphics.drawRect(bottomBoundingBox.x, bottomBoundingBox.y, bottomBoundingBox.width, bottomBoundingBox.height);
    }

    for (var i = 0; i < grounds.length; i++) {
        if (collides(bottomBoundingBox, grounds[i])) {
               bottomColliding = true;
        }
    }

    for (var i = 0; i < walls.length; i++) {
        if (collides(leftBoundingBox, walls[i])) {
               leftColliding = true;
        }
        if (collides(rightBoundingBox, walls[i])) {
            rightColliding = true;
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
        this.sprite.position.y = 793;
        this.contactGroundEvent = true;
        this.isInAir = false;
        this.hasDoubleJumped = false;
        this.hasWallJumped = false;
    }

    if(leftColliding){
        this.isOnWall = true;
        this.isDashing = false;
        if(!this.isWallJumping){
            this.movementVector.x = 0;
        }
        this.sprite.position.x = 64 + this.sprite.width / 2 -2;
    } else if (rightColliding){
        this.isOnWall = true;
        this.isDashing = false;
        if(!this.isWallJumping){
            this.movementVector.x = 0;
        }
        this.sprite.position.x = 704 - this.sprite.width / 2 +2;
    } else {
        this.isOnWall = false;
    }

    if (Key.isDown(Key.LEFT)) {
        if(!this.isDashing & !this.isWallJumping){
            this.movementVector.x = Math.min(Math.max(this.movementVector.deltaX(-0.35), -5),2);
            this.faceDirection = "left";
        }
        if(!this.isInAir){
            this.switchToSprite(this.sprites.moveLeft, this.sprite.position.x, this.sprite.position.y);
        } else if(!this.isWallJumping){
            this.switchToSprite(this.sprites.jumpLeft, this.sprite.position.x, this.sprite.position.y);
        }
    }
    else if (Key.isDown(Key.RIGHT)) {
        if(!this.isDashing & !this.isWallJumping){
            this.movementVector.x = Math.max(Math.min(this.movementVector.deltaX(+0.35), 5),-2);
            this.faceDirection = "right";
        }
        if(!this.isInAir){
            this.switchToSprite(this.sprites.moveRight, this.sprite.position.x, this.sprite.position.y);
        } else if(!this.isWallJumping){
            this.switchToSprite(this.sprites.jumpRight, this.sprite.position.x, this.sprite.position.y);
        }
    } else {
        this.entschleunigen();
    }

    this.applyMovementVector(delta);


};
