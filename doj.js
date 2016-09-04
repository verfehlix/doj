window.onload = init;

function init() {
	//SETTINGS
	var width = 768;
	var height = 888;
    var center = {
        x: width/2,
        y: height/2
    };
	var bgColor = 0x58627a;

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

		.add('img/blocky/walkleft.json')
		.add('img/blocky/walkright.json')

        .add("ground", "img/grasstop.png")
		.add("wall", "img/wall.png")

		.load(setup);

    //HOOK KEYBOARD EVENTS TO KEY.JS
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    //PLAYER
    var player;
    var grounds = [];
	var walls = [];

	//SETUP
	function setup() {

        for (var i = 0; i < 12 * 64; i+=64) {
            var ground = createNewGroundSprite(i,height-64, 64, 64);
            grounds.push(ground);
            stage.addChildAt(ground,0);
        }

		for (var i = 0; i < 13 * 64; i+=64) {
            var wall = createNewWallSprite(width-64,i-8, 64, 64);
            walls.push(wall);
            stage.addChildAt(wall,0);
        }

		for (var i = 0; i < 13 * 64; i+=64) {
            var wall = createNewWallSprite(0,i-8, 64, 64);
            walls.push(wall);
            stage.addChildAt(wall,0);
        }

        player = new Player(stage, center.x, center.y);

		startAnimating();
	};

    let last = performance.now()
	var stop = false;

	function startAnimating() {
	    animate();
	}

	// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved

	function animate() {

	    // request another frame
	    requestAnimationFrame(animate);
        gameLoop();

	}

	//GAME LOOP
	function gameLoop() {

        let now = performance.now();
        let elapsed = now - last;
        last = now;
		//Loop this function at 60 frames per second
		// requestAnimationFrame(gameLoop);
        player.update(grounds, walls, elapsed / 16); // auf 1 normalisiert, wegen 16.7 ms

		//Render the stage to see the animation
		renderer.render(stage);
	}

    var createNewGroundSprite = function(posX, posY, width, height) {
        // create a new Sprite using the Texture
        var texture = PIXI.loader.resources.ground.texture;
        var groundSprite = new PIXI.Sprite(texture);

        // set position
        groundSprite.position.x = posX;
        groundSprite.position.y = posY;

        // set size
        groundSprite.width = width;
        groundSprite.height = height;

        return groundSprite;
    };

	var createNewWallSprite = function(posX, posY, width, height) {
        // create a new Sprite using the Texture
        var texture = PIXI.loader.resources.wall.texture;
        var groundSprite = new PIXI.Sprite(texture);

        // set position
        groundSprite.position.x = posX;
        groundSprite.position.y = posY;

        // set size
        groundSprite.width = width;
        groundSprite.height = height;

        return groundSprite;
    };

}
