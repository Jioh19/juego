var stageWidth = 600;
var stageHeight = 400;
var scale = 10;

/* Animation variables */
var character, snow, gravity, stage, background, pWorld;

var renderer = new PIXI.autoDetectRenderer(stageWidth, stageHeight, {backgroundColor : 0x50aadd});

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);



PIXI.loader
    .add('spritesJson', 'images/megaman/sprites.json')
    .add('nightImg', 'images/nightsky.png')
    .load(onAssetsLoaded);

function onAssetsLoaded(loader, resources)
{
    gravity = 9.82;
    stage = new PIXI.Container();
    background = new PIXI.Sprite(resources.nightImg.texture);

    stage.addChild(background);

    startFrames = [];
    walkFrames = [];
    jumpFrames = [];
    climbFrames = [];
    stillFrames = [];
    dashFrames = [];

    // Start Frames 0-17
    for (var i = 1; i < 18; i++) {
        startFrames.push(PIXI.Texture.fromFrame('start-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('start-'+i));
    }

    // Walk Frames 18-32
    for (var i = 2; i < 17; i++) {
        walkFrames.push(PIXI.Texture.fromFrame('walk-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('walk-' + i));
    }

    // jump Frames 33-44
    for (var i = 1; i < 12; i++) {
        jumpFrames.push(PIXI.Texture.fromFrame('jump-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('jump-' + i));
    }

    // climb Frames 45-56
    for (var i = 1; i < 12; i++) {
        climbFrames.push(PIXI.Texture.fromFrame('climb-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('climb-' + i));
    }

    // dash Frames 57-65
    for (var i = 1; i < 9; i++) {
        dashFrames.push(PIXI.Texture.fromFrame('dash-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('dash-' + i));
    }

    // still Frames 66-71
    for (var i = 1; i < 6; i++) {
        stillFrames.push(PIXI.Texture.fromFrame('still-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('still-' + i));
    }

    megaMovie = new PIXI.extras.MovieClip(megamanFrames);

    character = new PIXI.Sprite(startFrames[0]);
    character.anchor.set(0.5);
    character.grounded = false;
    character.speedX = 0;
    character.speedY = 0;

    left.press = function(){
        character.walkLeft = true;
        character.currentFrame = 0;
        character.maxFrame = walkFrames.length-1;
        character.texture = walkFrames[0];
        character.scale.x = -1;
        character.speedX = -1;
    }

    left.release =  function(){
        character.walkLeft = false;
    }

    right.press = function(){
        character.walkRight = true;
        character.currentFrame = 0;
        character.maxFrame = walkFrames.length-1;
        character.texture = walkFrames[0];
        character.scale.x = 1;
        character.speedX = 1;
    }

    right.release = function(){
        character.walkRight = false;
    }

    up.press = function(){
        if(character.grounded){
            character.jump = true;
            character.currentFrame = 0;
            character.maxFrame = jumpFrames.length-1;
            character.texture = jumpFrames[0];
        }
    }

    down.press = function(){
        character.walkDown = true;
        character.currentFrame = 0;
        character.maxFrame = dashFrames.length-1;
        character.texture = dashFrames[0];
    }

    down.release = function(){
        character.walkDown = false;
    }

    snow = PIXI.Sprite.fromImage('images/snow.png');
    snow.position.x = 200;
    snow.position.y = 200;
    snow.anchor.set(0.5);
    snow.speedX = 4;
    snow.speedY = 4;

    stage.addChild(character);
    stage.addChild(snow);
    animate();
}



// Create a body for the cursor
/*
mouseBody = new p2.Body();
world.addBody(mouseBody);
*/

// Animation loop
function animate(){
    requestAnimationFrame(animate);

    if(snow.position.x <= 0 || snow.position.x >= stageWidth){
        snow.speedX *= -1;
    }

    if(snow.position.y <= 0 || snow.position.y >= stageHeight){
        snow.speedY *= -1;
    }

    snow.position.x += snow.speedX;
    snow.position.y += snow.speedY;

    if(character.walkLeft){
        character.position.x += character.speedX;
        character.texture = walkFrames[character.currentFrame];
        if(character.currentFrame < character.maxFrame)
            character.currentFrame++;
        else
            character.currentFrame = 0;
    }
    else if(character.walkRight){
        character.position.x += character.speedX;
        character.texture = walkFrames[character.currentFrame];
        if(character.currentFrame < character.maxFrame)
            character.currentFrame++;
        else
            character.currentFrame = 0;
    }

    if(character.jump){
        character.speedY = -25;
    }
    
    if(character.walkDown){
        character.texture = dashFrames[character.currentFrame];
        if(character.currentFrame < character.maxFrame)
            character.currentFrame++;
        else
            character.currentFrame = 0;
    }

    if(collision(character, snow)){
        character.texture = climbFrames[0];
    }


    if(character.position.y + character.height/2 >= stageHeight-5){
        character.grounded = true;
        character.position.y = (stageHeight - character.height/2) + character.speedY;
    }
    else{
        character.position.y += gravity + character.speedY;
        character.grounded = false;
        character.jump = false;
        if(character.speedY < 0)
            character.speedY += 1;
    }

    renderer.render(stage);
}


var left = keyboard(37);
var up = keyboard(38);
var right = keyboard(39);
var down = keyboard(40);

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}


function collision(a, b){
    var aPosX = a.position.x;
    var aPosY = a.position.y;
    var bPosX = b.position.x;
    var bPosY = b.position.y;
    var aWidth = a.width;
    var aHeight = a.height;
    var bWidth = b.width;
    var bHeight = b.height;

    if(a.scale.x === -1){
        aWidth = a.width * -1;
    }

    if(b.scale.x === -1){
        bWidth = b.width * -1;
    }

    if(a.scale.y === -1){
        aHeight = a.height * -1;
    }

    if(b.scale.y === -1){
        bHeight = b.height * -1;
    }

    var xdist = aPosX - bPosX;

    if(xdist > -aWidth/2 && xdist < aWidth/2)
    {
        var ydist = aPosY - bPosY;
    
        if(ydist > -aHeight/2 && ydist < aHeight/2)
        {
            return true;
        }
    }
}
