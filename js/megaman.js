var stageWidth = 600;
var stageHeight = 400;
var scale = 10;

var renderer = new PIXI.autoDetectRenderer(stageWidth, stageHeight, {backgroundColor : 0x50aadd});

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

var character, leftFrames, rightFrames, upFrames, downFrames;
var graphics = new PIXI.Graphics();
graphics.beginFill(0xFF3300);
graphics.lineStyle(4, 0xffd900, 1);

// draw a shape
graphics.moveTo(0,stageHeight-70);
graphics.lineTo(stageWidth, stageHeight-70)
graphics.endFill();


stage.addChild(graphics);
PIXI.loader
    .add('images/megaman/sprites.json')
    .load(onAssetsLoaded);

function onAssetsLoaded()
{
    // create an array of textures from an image path
    leftFrames = [];
    rightFrames = [];
    upFrames = [];
    downFrames = [];

    for (var i = 1; i < 18; i++) {

        // magically works since the spritesheet was loaded with the pixi loader
        leftFrames.push(PIXI.Texture.fromFrame('start-' + i));
    }


    for (var i = 2; i < 17; i++) {

        // magically works since the spritesheet was loaded with the pixi loader
        rightFrames.push(PIXI.Texture.fromFrame('walk-' + i));
    }


    for (var i = 1; i < 12; i++) {

        // magically works since the spritesheet was loaded with the pixi loader
        upFrames.push(PIXI.Texture.fromFrame('jump-' + i));
    }


    for (var i = 1; i < 9; i++) {

        // magically works since the spritesheet was loaded with the pixi loader
        downFrames.push(PIXI.Texture.fromFrame('dash-' + i));
    }

    character = new PIXI.Sprite(leftFrames[01]);

    left.press = function(){
        character.walkLeft = true;
        character.currentFrame = 0;
        character.tick = 1;
        character.tickFrame = 5;
        character.maxFrame = leftFrames.length-1;
        character.texture = leftFrames[0];
    }

    left.release =  function(){
        character.walkLeft = false;
    }

    right.press = function(){
        character.walkRight = true;
        character.currentFrame = 0;
        character.tick = 1;
        character.tickFrame = 5;
        character.maxFrame = rightFrames.length-1;
        character.texture = rightFrames[0];
    }

    right.release = function(){
        character.walkRight = false;
    }

    up.press = function(){
        character.walkUp = true;
        character.currentFrame = 0;
        character.tick = 1;
        character.tickFrame = 5;
        character.maxFrame = upFrames.length-1;
        character.texture = upFrames[0];
    }


    up.release = function(){
        character.walkUp = false;
    }


    down.press = function(){
        character.walkDown = true;
        character.currentFrame = 0;
        character.tick = 1;
        character.tickFrame = 5;
        character.maxFrame = downFrames.length-1;
        character.texture = downFrames[0];
    }

    down.release = function(){
        character.walkDown = false;
    }


    stage.addChild(character);
    animate();
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




function animate() {

    // render the stage container
    renderer.render(stage);
    if(character.walkLeft){
        character.position.x--;
        if(character.currentFrame < character.maxFrame){
            character.tick++
            if(character.tick >= character.tickFrame){
                character.currentFrame++;
                character.tick = 1;
            }
        }
        else{
            character.currentFrame = 0;
        }
        character.texture = leftFrames[character.currentFrame];
    }
    if(character.walkRight){
        character.position.x++;
        if(character.currentFrame < character.maxFrame){
            character.tick++
            if(character.tick >= character.tickFrame){
                character.currentFrame++;
                character.tick = 1;
            }
        }
        else{
            character.currentFrame = 0;
        }
        character.texture = rightFrames[character.currentFrame];
    }
    if(character.walkUp){
        character.position.y--;
        if(character.currentFrame < character.maxFrame){
            character.tick++
            if(character.tick >= character.tickFrame){
                character.currentFrame++;
                character.tick = 1;
            }
        }
        else{
            character.currentFrame = 0;
        }
        character.texture = upFrames[character.currentFrame];
    }
    if(character.walkDown){
        character.position.y++;
        if(character.currentFrame < character.maxFrame){
            character.tick++
            if(character.tick >= character.tickFrame){
                character.currentFrame++;
                character.tick = 1;
            }
        }
        else{
            character.currentFrame = 0;
        }
        character.texture = downFrames[character.currentFrame];
    }

    requestAnimationFrame(animate);
}