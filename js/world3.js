var stageWidth = 600;
var stageHeight = 400;
var scale = 10;

/* Animation variables */
var character, walkFrames, jumpFrames, startFrames, dashFrames, climbFrames, stillFrames,
world, groundBody, groundShape, wallBody, wallShape, wallBody2, wallShape2, 
waterMaterial, concreteMaterial, concreteWaterContactMaterial,
stage, background, pWorld;

var renderer = new PIXI.autoDetectRenderer(stageWidth, stageHeight, {backgroundColor : 0x50aadd});

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);



PIXI.loader
    .add('spritesJson', 'images/megaman/sprites.json')
    .add('nightImg', 'images/nightsky.png')
    .load(onAssetsLoaded);

function onAssetsLoaded(loader, resources)
{

    // Init p2.js
    world = new p2.World({gravity: [0, -9.82]});

    // Create custom Materials
    waterMaterial = new p2.Material();
    concreteMaterial = new p2.Material();


    // Add a ground
    groundBody = new p2.Body({ position:[0,0] });
    groundShape = new p2.Plane();

    groundShape.material = concreteMaterial;
    groundBody.addShape(groundShape);
    world.addBody(groundBody);

    wallBody = new p2.Body({ position:[600,0], angle: Math.PI/2 });
    wallShape = new p2.Plane();
    wallShape.material = concreteMaterial;
    wallBody.addShape(wallShape);
    world.addBody(wallBody);

    wallBody2 = new p2.Body({ position:[0,0], angle: -Math.PI/2 });
    wallShape2 = new p2.Plane();
    wallShape2.material = concreteMaterial;
    wallBody2.addShape(wallShape2);
    world.addBody(wallBody2);

    concreteWaterContactMaterial = new p2.ContactMaterial(concreteMaterial, waterMaterial, {
        friction : 0.62 * scale,
        restitution: 1/scale,
    });
    world.addContactMaterial(concreteWaterContactMaterial);


    stage = new PIXI.Container();
    background = new PIXI.Sprite(resources.nightImg.texture);
    pWorld = new PIXI.Container();

    background.interactive = true;
    background
        .on('mousedown', onDrawStart)
        .on('touchstart', onDrawStart)
                // events for drag end
        .on('mouseup', onDrawEnd)
        .on('mouseupoutside', onDrawEnd)
        .on('touchend', onDrawEnd)
        .on('touchendoutside', onDrawEnd)
        // events for drag move
        .on('mousemove', onDrawMove)
        .on('touchmove', onDrawMove);


    /* we need to reverse the world in order to work with p2.js*/
    pWorld.scale.y = -1;
    pWorld.position.y = stageHeight;

    stage.addChild(background);
    stage.addChild(pWorld);



    startFrames = [];
    walkFrames = [];
    jumpFrames = [];
    climbFrames = [];
    stillFrames = [];
    dashFrames = [];

    for (var i = 1; i < 18; i++) {
        startFrames.push(PIXI.Texture.fromFrame('start-' + i));
    }

    for (var i = 2; i < 17; i++) {
        walkFrames.push(PIXI.Texture.fromFrame('walk-' + i));
    }

    for (var i = 1; i < 12; i++) {
        jumpFrames.push(PIXI.Texture.fromFrame('jump-' + i));
        climbFrames.push(PIXI.Texture.fromFrame('climb-' + i));
    }

    for (var i = 1; i < 9; i++) {
        dashFrames.push(PIXI.Texture.fromFrame('dash-' + i));
    }

    for (var i = 1; i < 6; i++) {
        stillFrames.push(PIXI.Texture.fromFrame('still-' + i));
    }

    character = new PIXI.Sprite(startFrames[0]);

    charShape = new p2.Box({ width: 30, height: 40 });
    charBody = new p2.Body({
        mass:1,
        position:[300, 200],
        gravityScale: scale*2,
    });
    charShape.material = waterMaterial;
    charBody.addShape(charShape);
    world.addBody(charBody);

    character = new PIXI.Sprite(startFrames[0]);
    character.scale.y = -1;
    character.anchor.set(0.5);
    character.physics = charBody;

    left.press = function(){
        character.walkLeft = true;
        character.currentFrame = 0;
        character.tick = 1;
        character.tickFrame = 5;
        character.maxFrame = walkFrames.length-1;
        character.texture = walkFrames[0];
        character.scale.x = -1;
    }

    left.release =  function(){
        character.walkLeft = false;
    }

    right.press = function(){
        character.walkRight = true;
        character.currentFrame = 0;
        character.tick = 1;
        character.tickFrame = 5;
        character.maxFrame = walkFrames.length-1;
        character.texture = walkFrames[0];
        character.scale.x = 1;
    }

    right.release = function(){
        character.walkRight = false;
    }

    up.press = function(){
        character.walkUp = true;
        character.currentFrame = 0;
        character.tick = 1;
        character.tickFrame = 5;
        character.maxFrame = jumpFrames.length-1;
        character.texture = jumpFrames[0];
    }


    up.release = function(){
        character.walkUp = false;
    }


    down.press = function(){
        character.walkDown = true;
        character.currentFrame = 0;
        character.tick = 1;
        character.tickFrame = 5;
        character.maxFrame = dashFrames.length-1;
        character.texture = dashFrames[0];
    }

    down.release = function(){
        character.walkDown = false;
    }

    pWorld.addChild(character);
    animate();
}



// Create a body for the cursor
/*
mouseBody = new p2.Body();
world.addBody(mouseBody);
*/

// Animation loop
function animate(t){
    t = t || 0;
    requestAnimationFrame(animate);

    // Move physics bodies forward in time
    world.step(1/60);

    pWorldLength = pWorld.children.length;

    for(var x=0; x<pWorldLength; x++){
        var obj = pWorld.children[x];
        if(obj.physics){
            obj.position.x = obj.physics.position[0];
            obj.position.y = obj.physics.position[1];
            obj.rotation =   obj.physics.angle;
        }
    }

    if(character.walkLeft){
        character.physics.position[0] -= 1;
    }
    else if(character.walkRight){
        character.physics.position[0] += 1;
    }

    if(character.walkUp){
        character.physics.velocity[1] = 150;
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


function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch

    this.data = event.data;


    this.original = {};
    this.original.x = event.target.position.x;
    this.original.y = event.target.position.y;
    /*
    this.sx = event.data.global.x - event.target.position.x;
    this.sy = (stageHeight - event.data.global.y) - event.target.position.y;
    */


    mouseBody.position[0] = event.data.global.x;
    mouseBody.position[1] = stageHeight - event.data.global.y;

    mouseConstraint = new p2.RevoluteConstraint(mouseBody, this.physics, {
        worldPivot: mouseBody.position,
        collideConnected:false
    });
    world.addConstraint(mouseConstraint);

    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd(event)
{
    this.alpha = 1;
    var droppable = true;
    if(this.dragging)
        world.removeConstraint(mouseConstraint);
    this.dragging = false;
    mouseConstraint = null;

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        /*
        this.position.x = newPosition.x - this.sx;
        this.position.y = newPosition.y - this.sy;

        this.physics.position[0] = newPosition.x - this.sx;
        this.physics.position[1] = newPosition.y - this.sy;
        */
        mouseBody.position[0] = newPosition.x;
        mouseBody.position[1] = newPosition.y;

    }
}


function onDrawStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;

    this.original = {};
    this.original.x = event.data.global.x;
    this.original.y = stageHeight - event.data.global.y;
    this.drawing = true;

    for(var x=0; x<2; x++){
        for(var y=0; y<2; y++){
            square = square = boxGeneration((event.data.global.x+(x*scale)), ((stageHeight - event.data.global.y)+y*scale), scale, scale);
            pWorld.addChild(square); 
        }           
    }
}

function onDrawEnd(event)
{
    this.alpha = 1;
    this.drawing = false;

    // set the interaction data to null
    this.data = null;
}

function onDrawMove(event)
{
    if (this.drawing)
    {
        for(var x=0; x<2; x++){
            for(var y=0; y<2; y++){
                square = square = boxGeneration((event.data.global.x+(x*scale)), ((stageHeight - event.data.global.y)+y*scale), scale, scale);
                pWorld.addChild(square); 
            }           
        }
    }
}


function boxGeneration(posX, posY, boxWidth, boxHeight){

    var boxShape = new p2.Circle({ radius: boxWidth/2 });
    var boxBody = new p2.Body({
        angularVelocity: 1,
        mass:1,
        position:[posX, posY],
        gravityScale: scale,
    });
    boxShape.material = waterMaterial;
    boxBody.addShape(boxShape);
    world.addBody(boxBody);

    var diskSprite = PIXI.Sprite.fromImage('images/snow.png');
    diskSprite.position.x = posX;
    diskSprite.position.y = posY;
    diskSprite.anchor.set(0.5);
    diskSprite.width = boxWidth;
    diskSprite.height = boxHeight;
    diskSprite.interactive = true;
    diskSprite.buttonMode = true;
    diskSprite.physics = boxBody;
    /*
    diskSprite
            .on('mousedown', onDragStart)
            .on('touchstart', onDragStart)
            // events for drag end
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            .on('touchend', onDragEnd)
            .on('touchendoutside', onDragEnd)
            // events for drag move
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove);

    */

    /*
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0xff0000);
    //we don't need the coordinates since animate will take care of it...
    graphics.drawRect(0, 0, boxWidth, boxHeight);

    graphics.physics = boxBody;
    graphics.interactive = true;
    graphics.buttonMode = true;

    graphics
            // events for drag start
            .on('mousedown', onDragStart)
            .on('touchstart', onDragStart)
            // events for drag end
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            .on('touchend', onDragEnd)
            .on('touchendoutside', onDragEnd)
            // events for drag move
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove);
    // Add the box to our container
    */
    return diskSprite;
}
