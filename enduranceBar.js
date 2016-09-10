class EnduranceBar {
    constructor(stage, x, y) {

        this.stage = stage;

        this.graphics = new PIXI.Graphics();
        this.stage.addChild(this.graphics);

    }
}

EnduranceBar.prototype.update = function(enduranceValue) {


    this.graphics.clear();
    this.graphics.beginFill(0xf200ff);
    this.graphics.drawRect(100, 100, 100, 100);


};
