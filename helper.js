function collides(playerSprite, otherSprite) {

    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    playerSprite.centerX = playerSprite.x + playerSprite.width / 2;
    playerSprite.centerY = playerSprite.y + playerSprite.height / 2;
    otherSprite.centerX = otherSprite.x + otherSprite.width / 2;
    otherSprite.centerY = otherSprite.y + otherSprite.height / 2;

    //Find the half-widths and half-heights of each sprite
    playerSprite.halfWidth = playerSprite.width / 2;
    playerSprite.halfHeight = playerSprite.height  / 2;
    otherSprite.halfWidth = otherSprite.width / 2;
    otherSprite.halfHeight = otherSprite.height / 2;

    //Calculate the distance vector between the sprites
    vx = playerSprite.centerX - otherSprite.centerX;
    vy = playerSprite.centerY - otherSprite.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = playerSprite.halfWidth + otherSprite.halfWidth;
    combinedHalfHeights = playerSprite.halfHeight + otherSprite.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

          //There's definitely a collision happening
          hit = true;

        } else {

          //There's no collision on the y axis
          hit = false;

        }
    } else {

        //There's no collision on the x axis
        hit = false;

    }

    //`hit` will be either `true` or `false`
    return hit;
};

function moveTowardsAngle(startPos, radians, movementAmount){
    startPos.x -= movementAmount * Math.cos(radians);
    startPos.y -= movementAmount * Math.sin(radians);
}

function radiansToDegrees(radians){
    return radians * (180/Math.PI)
}

function degreesToRadians(degrees){
    return degrees / 180 * Math.PI
    // return degrees * Math.PI/180
}
