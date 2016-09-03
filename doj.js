window.onload = init;

function init() {
	//SETTINGS
	var width = 768;
	var height = 888;
    var center = {
        x: width/2,
        y: height/2
    };
	var worldBorderOffset = 25;
	var bgColor = 0x777AAA;

	//PIXI JS ALIASES
	var Container = PIXI.Container,
		autoDetectRenderer = PIXI.autoDetectRenderer,
		loader = PIXI.loader,
		resources = PIXI.loader.resources,
		Sprite = PIXI.Sprite;

	//RENDERER & STAGE
	var renderer = PIXI.autoDetectRenderer(width, height),
		stage = new PIXI.Container();
	renderer.backgroundColor = bgColor;
	document.body.appendChild(renderer.view);

	//IMAGE LOADING
	loader
		.add("blockyFront", "img/blocky/blocky.png")
		.add("blockyLeft", "img/blocky/blocky_left.png")
		.add("blockyRight", "img/blocky/blocky_right.png")
		.add("blockySlideLeft1","img/blocky/blocky_slideleft_1.png")
		.add("blockySlideLeft2","img/blocky/blocky_slideleft_2.png")
		.add("blockySlideRight1","img/blocky/blocky_slideright_1.png")
		.add("blockySlideRight2","img/blocky/blocky_slideright_2.png")
		.add("blockyJumpLeft","img/blocky/jumpleft.png")
		.add("blockyJumpRight","img/blocky/jumpright.png")

        .add("ground", "img/grasstop.png")

		.add('img/blocky/walkleft.json')
		.add('img/blocky/walkright.json')

		.load(setup);

    //HOOK KEYBOARD EVENTS TO KEY.JS
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    //PLAYER
    var player;
    var walls = [];

	//SETUP
	function setup() {

        for (var i = 0; i < 12 * 64; i+=64) {
            var ground = createNewGroundSprite(i,height-64, 64, 64);
            walls.push(ground);
            stage.addChild(ground);
        }

        player = new Player(stage, center.x, center.y);

		startAnimating(120);
	};

	// initialize the timer variables and start the animation
	var stop = false;
	var frameCount = 0;
	var fps, fpsInterval, startTime, now, then, elapsed;

	function startAnimating(fps) {
	    fpsInterval = 1000 / fps;
	    then = Date.now();
	    startTime = then;
	    animate();
	}

	// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved

	function animate() {

	    // request another frame

	    requestAnimationFrame(animate);

	    // calc elapsed time since last loop

	    now = Date.now();
	    elapsed = now - then;

	    // if enough time has elapsed, draw the next frame

	    if (elapsed > fpsInterval) {

	        // Get ready for next frame by setting then=now, but also adjust for your
	        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
	        then = now - (elapsed % fpsInterval);

	        gameLoop();

	    }
	}

	//GAME LOOP
	function gameLoop() {

		//Loop this function at 60 frames per second
		// requestAnimationFrame(gameLoop);

        player.update(walls);

		//Render the stage to see the animation
		renderer.render(stage);
	}

    var createNewGroundSprite = function(posX, posY, width, height) {
        // create a new Sprite using the Texture
        var texture = PIXI.loader.resources.ground.texture;
        var playerSprite = new PIXI.Sprite(texture);

        // // center the sprite's anchor point
        // playerSprite.anchor.x = 0.5;
        // playerSprite.anchor.y = 0.5;

        // set position
        playerSprite.position.x = posX;
        playerSprite.position.y = posY;

        // set size
        playerSprite.width = width;
        playerSprite.height = height;

        return playerSprite;
    };

}
