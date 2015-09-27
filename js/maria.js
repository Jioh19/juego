var stageWidth = 600;
var stageHeight = 400;
var scale = 10;

var renderer = new PIXI.autoDetectRenderer(stageWidth, stageHeight, {backgroundColor : 0x50aadd});

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

PIXI.loader
    .add('images/maria/maria_spritesheet.json')
    .load(onAssetsLoaded);

var movie;

function onAssetsLoaded()
{
    // create an array of textures from an image path
    var frames = [];

    for (var i = 271; i < 283; i++) {

        // magically works since the spritesheet was loaded with the pixi loader
        frames.push(PIXI.Texture.fromFrame('IMG00' + i + '.png'));
    }


    // create a MovieClip (brings back memories from the days of Flash, right ?)
    movie = new PIXI.extras.MovieClip(frames);

    /*
     * A MovieClip inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    movie.position.set(300);

    movie.anchor.set(0.5);
    movie.animationSpeed = 0.2;

    movie.play();

    stage.addChild(movie);

    animate();
}
function animate() {
    movie.position.x += 0.5;

    // render the stage container
    renderer.render(stage);

    requestAnimationFrame(animate);
}