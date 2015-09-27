var stageWidth = 600;
var stageHeight = 400;
var scale = 10;

/* Animation variables */
var mega, megamanFrames, snow, gravity, stage, background, pWorld,
walkEnd, startEnd, jumpEnd, dashEnd, climbEnd, stillEnd;

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
    megamanFrames = [];

    // Start Frames 0-17
    for (var i = 1; i < 18; i++) {
        startFrames.push(PIXI.Texture.fromFrame('start-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('start-'+i));
    }
    startEnd = 17;

    // Walk Frames 18-32
    for (var i = 2; i < 17; i++) {
        walkFrames.push(PIXI.Texture.fromFrame('walk-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('walk-' + i));
    }
    walkEnd = 31;

    // jump Frames 33-43
    for (var i = 1; i < 12; i++) {
        jumpFrames.push(PIXI.Texture.fromFrame('jump-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('jump-' + i));
    }
    jumpEnd = 43;

    // climb Frames 45-56
    for (var i = 1; i < 12; i++) {
        climbFrames.push(PIXI.Texture.fromFrame('climb-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('climb-' + i));
    }
    climbEnd = 54;

    // dash Frames 57-62
    for (var i = 1; i < 9; i++) {
        dashFrames.push(PIXI.Texture.fromFrame('dash-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('dash-' + i));
    }
    dashEnd = 62;

    // still Frames 63-67
    for (var i = 1; i < 6; i++) {
        stillFrames.push(PIXI.Texture.fromFrame('still-' + i));
        megamanFrames.push(PIXI.Texture.fromFrame('still-' + i));
    }

    stillEnd = 66;

    mega = new PIXI.extras.MovieClip(megamanFrames);
    mega.animationSpeed = 1;
    mega.anchor.set(0.5)
    mega.grounded = false;
    mega.speedX = 0;
    mega.speedY = 0;

    addStatePlayer(mega);
    /*
    character = new PIXI.Sprite(startFrames[0]);
    character.anchor.set(0.5);
    character.grounded = false;
    character.speedX = 0;
    character.speedY = 0;
    */

    left.press = function(){
        mega.walkLeft = true;
        mega.speedX = -2;
        mega.scale.x = -1;
        mega.playSequence([18, walkEnd]);
    }

    left.release =  function(){
        mega.walkLeft = false;
    }

    right.press = function(){
        mega.walkRight = true;
        mega.speedX = 2;
        mega.scale.x = 1;
        mega.playSequence([18, walkEnd]);
        /*
        character.walkRight = true;
        character.currentFrame = 0;
        character.maxFrame = walkFrames.length-1;
        character.texture = walkFrames[0];
        character.scale.x = 1;
        character.speedX = 1;
        */
    }

    right.release = function(){
        mega.walkRight = false;
    }

    
    up.press = function(){
        if(mega.grounded){
            mega.speedY = -20;
            mega.playSequence([33, jumpEnd], false);
            mega.jump = true;
        }
    }

    /*
    down.press = function(){
        character.walkDown = true;
        character.currentFrame = 0;
        character.maxFrame = dashFrames.length-1;
        character.texture = dashFrames[0];
    }

    down.release = function(){
        character.walkDown = false;
    }
    */

    snow = PIXI.Sprite.fromImage('images/snow.png');
    snow.position.x = 200;
    snow.position.y = 200;
    snow.anchor.set(0.5);
    snow.speedX = 4;
    snow.speedY = 4;

    stage.addChild(mega);
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

    if(snow.position.x <= 0 || snow.position.x >= stageWidth){
        snow.speedX *= -1;
    }

    if(snow.position.y <= 0 || snow.position.y >= stageHeight){
        snow.speedY *= -1;
    }

    snow.position.x += snow.speedX;
    snow.position.y += snow.speedY;

    if(mega.walkLeft){
        mega.position.x += mega.speedX;
    }
    else if(mega.walkRight){
        mega.position.x += mega.speedX;
    }
    else{
        if(mega.currentFrame < 57){
            mega.playSequence([63, stillEnd]);
        }
    }

    if(mega.jump){
        mega.position.y += mega.speedY;
    }

    if(collision(mega, snow)){
        mega.playSequence([57, 62]);
    }


    if(mega.position.y + mega.height/2 >= stageHeight-5){
        mega.grounded = true;
        mega.position.y = (stageHeight - mega.height/2) + mega.speedY;
        mega.speedY = 0;
        if(mega.walkRight && !mega.customPlaying || mega.walkLeft && !mega.customPlaying){
            mega.playSequence([18, walkEnd]);
        }
    }
    else{
        mega.position.y += gravity + mega.speedY;
        mega.grounded = false;
        mega.jump = false;
        if(mega.speedY < 0)
            mega.speedY += 1;
    }

    requestAnimationFrame(animate);
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













/*
An advanced frame and state manager for Pixi MovieClip sprites.
Use it like this:

Add the advanced state player to a PIXI.MovieClip

    addStatePlayer(movieClipSprite);

Set the frame rate

    movieClipSprite.fps = 12;

Play any sequence of frames
(provide a start frame and end frame as a two element array)

    movieClipSprite.playSequence([startFrameNumber, endFrameNumber]);

Show a specific frame (this is a convenience wrapper for `gotoAndStop`)

    movieClipSprite.show(anyFrameNumber);
    
*/

function addStatePlayer(sprite) {
  //Make sure the sprite is a Pixi MovieClip
  if (!(sprite instanceof PIXI.extras.MovieClip)) {
    throw new Error("You can only animate PIXI.MovieClip sprites");
    return;
  }
  
  //Intialize the variables
  var frameCounter = 0,
      numberOfFrames = 0,
      startFrame = 0,
      endFrame = 0,
      timerInterval = undefined,
      playing = false;
  
  //The `show` function (to display static states)
  function show(frameNumber) {
    //Reset any possible previous animations
    reset();
    //Find the new state on the sprite 
    sprite.gotoAndStop(frameNumber);
  };

  //The `playSequence` function, to play a sequence of frames
  function playSequence(sequenceArray, loop) {
    if(typeof loop === "undefined"){
        loop = true;
    }
    else{
        loop = false;
    }
    //Reset any possible previous animations
    reset();
    //Figure out how many frames there are in the range
    startFrame = sequenceArray[0];
    endFrame = sequenceArray[1];
    numberOfFrames = endFrame - startFrame;
    //Calculate the frame rate. Set a default fps of 12
    if (!sprite.fps) sprite.fps = 20;
    var frameRate = 1000 / sprite.fps;
    //Set the sprite to the starting frame
    sprite.gotoAndStop(startFrame);
    sprite.customLoop = loop;
    //If the state isn't already playing, start it

    sprite.customPlaying = playing;
    if(!playing) {
        console.log(frameRate);
      timerInterval = setInterval(advanceFrame.bind(this), frameRate);
      playing = true;
      sprite.customPlaying = playing;
    }
  };
  
  //`advanceFrame` is called by `setInterval` to dislay the next frame
  //in the sequence based on the `frameRate`. When frame sequence
  //reaches the end, it will either stop it or loop it.
  function advanceFrame() {
    //Advance the frame if `frameCounter` is less than 
    //the state's total frames
    if (frameCounter < numberOfFrames) {
      //Advance the frame
      sprite.gotoAndStop(sprite.currentFrame + 1);
      //Update the frame counter
      frameCounter += 1;
    } else {
      //If we've reached the last frame and `loop`
      //is `true`, then start from the first frame again
      if (sprite.customLoop) {
        sprite.gotoAndStop(startFrame);
        frameCounter = 0;
      }
      else{
        reset();
      }
    }
  }
  
  function reset() {
    //Reset `playing` to `false`, set the `frameCounter` to 0,
    //and clear the `timerInterval`
    if (timerInterval !== undefined && playing === true) {
      playing = false;
      frameCounter = 0;
      startFrame = 0;
      endFrame = 0;
      numberOfFrames = 0;
      sprite.customPlaying = playing;

      clearInterval(timerInterval);
    }
  }

  //Add the `show` and `playSequence` methods to the sprite
  sprite.show = show;
  sprite.playSequence = playSequence;
}