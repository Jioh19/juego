var stageWidth = 800;
var stageHeight = 600;
var renderer = new PIXI.WebGLRenderer(stageWidth, stageHeight, {backgroundColor : 0x50aadd});

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

/* P2 part */
// Create a physics world, where bodies and constraints live
var world = new p2.World();

// Create an empty dynamic body
var circleBody = new p2.Body({
    mass: 5,
    position: [0, 10]
});

// Add a circle shape to the body.
var circleShape = new p2.Circle({ radius: 1 });
circleBody.addShape(circleShape);

// ...and add the body to the world.
// If we don't add it to the world, it won't be simulated.
world.addBody(circleBody);

// Create an infinite ground plane.
var groundBody = new p2.Body({
    mass: 0 // Setting mass to 0 makes the body static
});
var groundShape = new p2.Plane();
groundBody.addShape(groundShape);
world.addBody(groundBody);



// Create the stage
var stage = new PIXI.Container();

var poles = new PIXI.Container();


for(var x=0; x<3; x++){
    var poleSprite = PIXI.Sprite.fromImage('images/pole.png');
    
    poleSprite.position.x = (200 * (x+1)) - 100 ;
    poleSprite.position.y = 200;
    poleSprite.scale.y = 2;
    poles.addChild(poleSprite);
}


stage.addChild(poles);

for(var x=0; x<8; x++){
    var diskSprite = PIXI.Sprite.fromImage('images/disk.png');
    var posY = 11 * x;
    var width = (x+1) / 2;
    diskSprite.position.x = 500;
    diskSprite.position.y = posY + 150;
    diskSprite.anchor.set(0.5);
    diskSprite.num = x;
    diskSprite.scale.x = width;
    diskSprite.position.x = 100;
    diskSprite.interactive = true;
    diskSprite.buttonMode = true;

    diskSprite
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

    stage.addChild(diskSprite);
}


animate();

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
    // this is the main render call that makes pixi draw your container and its children.
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
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd(event)
{
    this.alpha = 1;
    var droppable = true;
    polesNum = poles.children.length;
    for(var x=0; x<polesNum; x++){

    }
    this.dragging = false;
    if(!droppable){
        this.position.x = this.original.x;
        this.position.y = this.original.y;
    }

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

