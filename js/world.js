var stageWidth = 600;
var stageHeight = 400;
var scale = 10;

var renderer = new PIXI.autoDetectRenderer(stageWidth, stageHeight, {backgroundColor : 0x50aadd});

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);


// Init p2.js
var world = new p2.World({gravity: [0, -9.82]});

// Create custom Materials
var woodMaterial = new p2.Material();
var concreteMaterial = new p2.Material();


// Add a ground
var groundBody = new p2.Body({ position:[0,0] });
var groundShape = new p2.Plane();
groundShape.material = concreteMaterial;
groundBody.addShape(groundShape);
world.addBody(groundBody);

var wallBody = new p2.Body({ position:[600,0], angle: Math.PI/2 });
var wallShape = new p2.Plane();
wallShape.material = concreteMaterial;
wallBody.addShape(wallShape);
world.addBody(wallBody);

var wallBody2 = new p2.Body({ position:[0,0], angle: -Math.PI/2 });
var wallShape2 = new p2.Plane();
wallShape2.material = concreteMaterial;
wallBody2.addShape(wallShape2);
world.addBody(wallBody2);

var concreteWoodContactMaterial = new p2.ContactMaterial(concreteMaterial, woodMaterial, {
    friction : 0.62 * scale,
    restitution: 1/scale,
});
world.addContactMaterial(concreteWoodContactMaterial);

// Create a body for the cursor
mouseBody = new p2.Body();
world.addBody(mouseBody);



// Create the stage
var stage = new PIXI.Container();

var nightsky = PIXI.Texture.fromImage('images/nightsky.png');
var background = new PIXI.Sprite(nightsky);

var pWorld = new PIXI.Container();
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

var graphics = boxGeneration(300, 400, 1*scale, 2*scale);
pWorld.addChild(graphics);
// Add the canvas to the DOM
document.body.appendChild(renderer.view);

animate();

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

    renderer.render(stage);
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


    drawing = PIXI.Sprite.fromImage('images/square.png');
    drawing.position.x = event.data.global.x;
    drawing.position.y = stageHeight - event.data.global.y;
    drawing.anchor.set(0);
    drawing.width = 1;
    drawing.height = 1;
    drawing.interactive = true;
    pWorld.addChild(drawing);
}

function onDrawEnd(event)
{
    this.alpha = 1;

    if(this.drawing){
	    var width = Math.abs(drawing.width);
	    var height = Math.abs(drawing.height);
	    var cX = drawing.width/2 + drawing.position.x;
	    var cY = drawing.height/2 + drawing.position.y;


	    square = boxGeneration(cX, cY, width, height);
	    pWorld.removeChild(drawing);
	    pWorld.addChild(square);
	}
    this.drawing = false;

    // set the interaction data to null
    this.data = null;
}

function onDrawMove(event)
{
    if (this.drawing)
    {
        drawing.width = event.data.global.x - this.original.x;
        drawing.height = (stageHeight - event.data.global.y) - this.original.y;
    }
}


function boxGeneration(posX, posY, boxWidth, boxHeight){

    var boxShape = new p2.Box({ width: boxWidth, height: boxHeight });
    var boxBody = new p2.Body({
        angularVelocity: 1,
        mass:1,
        position:[posX, posY],
        gravityScale: scale,
    });
    boxShape.material = woodMaterial;
    boxBody.addShape(boxShape);
    world.addBody(boxBody);

    var diskSprite = PIXI.Sprite.fromImage('images/disk.png');
    diskSprite.position.x = posX;
    diskSprite.position.y = posY;
    diskSprite.anchor.set(0.5);
    diskSprite.width = boxWidth;
    diskSprite.height = boxHeight;
    diskSprite.interactive = true;
    diskSprite.buttonMode = true;
    diskSprite.physics = boxBody;
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
