// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.
var stageWidth = window.innerWidth;
var stageHeight = window.innerHeight;
var renderer = new PIXI.autoDetectRenderer(stageWidth, stageHeight, {backgroundColor : 0x50aadd});
renderer.autoResize = true;
renderer.resize(stageWidth, stageHeight);
// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

// Create the stage
var stage = new PIXI.Container();
var backgroundPic = PIXI.Texture.fromImage('images/background.jpg');
var background = new PIXI.Sprite(backgroundPic);
stage.addChild(background);
var score;

var scoreText = new PIXI.Text('Score: ' + score,{font : '24px Arial', fill : 0xff1010, align : 'center'});
scoreText.position.x = 50;
scoreText.position.y = 20;
scoreText.anchor.x = 0.5;
scoreText.anchor.y = 0.5;

var snowContainer = new PIXI.Container();
snowContainer.x = 0;
snowContainer.y = 0;
snowContainer.count = 400;

for(var i=0; i<snowContainer.count; i++){
    var snowSprite = PIXI.Sprite.fromImage('images/snow.png');

    switch (i%3) {
        case 0:
            scale = 1;
            break;
        case 1:
            scale = 1.5;
            break;
        case 2:
            scale = 2;
            break;
    }

    snowSprite.position.x = (Math.random() * (stageWidth * 0.9));
    snowSprite.position.y = (Math.random() * (stageHeight * 0.9));
    snowSprite.anchor.x = 0.5;
    snowSprite.anchor.y = 0.5;
    snowSprite.scale.x = scale;
    snowSprite.scale.y = scale;
    snowSprite.alpha = Math.random() - 1;
    snowSprite.visi = false;
    snowSprite.wait = i*30;
    snowSprite.index = i;
    if(i%2 !== 0){
        snowSprite.directionx = Math.random() * -1 /3;
        snowSprite.directiony = Math.random() * -1 /3;
    }
    else{
        snowSprite.directionx = Math.random()/3;
        snowSprite.directiony = Math.random()/3;
    }

    snowContainer.addChild(snowSprite);
}


// Create the question container
var questionContainer = new PIXI.Container();
questionContainer.x = 0;
questionContainer.y = 0;

// Create container for numbers
var numContainer = new PIXI.Container;
numContainer.x = 0;
numContainer.y = 0;

for(var x=0; x<10; x++){
    var number = new PIXI.Text(x,{font : '24px Arial', fill : 0xff1010, align : 'center'});
    number.interactive = true;
    number.number = x;
    number.position.x = stageWidth * 0.9;
    number.position.y = x*50 + 50;
    number.anchor.x = 0.5;
    number.anchor.y = 0.5;
    number.on('mousedown', numDown);
    number.on('touchstart', numDown);

    numContainer.addChild(number);
}

var startText = new PIXI.Text('START GAME',{font : '72px Arial', fill : 0xff1010, align : 'center'});
startText.position.x = stageWidth / 2;
startText.position.y = stageHeight / 2;
startText.anchor.x = 0.5;
startText.anchor.y = 0.5;
startText.interactive = true;
startText.on('mousedown', startGame);
startText.on('touchstart', startGame);

var start = false;

// The Enter button if it touched it will fire and check
var enter = new PIXI.Text('ENTER',{font : '24px Arial', fill : 0xff1010, align : 'center'});
enter.position.x = stageWidth * 0.8;
enter.position.y = stageHeight * 0.9;
enter.anchor.x = 0.5;
enter.anchor.y = 0.5;
enter.interactive = true;
enter.on('mousedown', fire);
enter.on('touchstart', fire);

// Answer will start empty
var answer = "";

var answerText = new PIXI.Text('Answer: ' + answer,{font : '24px Arial', fill : 0xff1010, align : 'center'});
answerText.position.x = stageWidth / 2;
answerText.position.y = stageHeight * 0.9;
answerText.anchor.x = 0.5;
answerText.anchor.y = 0.5;

var backspace = new PIXI.Text('<',{font : '24px Arial', fill : 0xff1010, align : 'center'});
backspace.interactive = true;
backspace.position.x = stageWidth * 0.9;
backspace.position.y = stageHeight * 0.9;
backspace.anchor.x = 0.5;
backspace.anchor.y = 0.5;
backspace.on('mousedown', backDown);
backspace.on('touchstart', backDown);

stage.addChild(snowContainer);
stage.addChild(startText);

animate();

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    for (var i = 0; i < snowContainer.children.length; i++){
        if(snowContainer.children[i].wait >= 4000){
            if(snowContainer.children[i].visi == false)
               snowContainer.children[i].alpha += 0.01;
            else
                snowContainer.children[i].alpha -= 0.01;

            if(snowContainer.children[i].alpha >= 0.9){
                snowContainer.children[i].visi = true;
            }
            else if(snowContainer.children[i].alpha <= 0.2){
                snowContainer.children[i].visi = false;
            }
        }
        

        if(snowContainer.children[i].position.x <= 0 || 
            snowContainer.children[i].position.x >= stageWidth ||
            snowContainer.children[i].position.y <= 0 ||
            snowContainer.children[i].position.y >= stageHeight){
                snowContainer.children[i].position.x = (Math.random() * stageWidth);
                snowContainer.children[i].position.y = (Math.random() * stageHeight);
                snowContainer.children[i].alpha = Math.random() - 1;
                snowContainer.children[i].visi = false;
                snowContainer.children[i].wait = 4000;
        }

        snowContainer.children[i].wait++;
        snowContainer.children[i].position.x += snowContainer.children[i].directionx;
        snowContainer.children[i].position.y += snowContainer.children[i].directiony;
    }

    if(start){
        if(questionContainer.children.length < 1){
            createQuestion();
        }

        var questionLength = questionContainer.children.length;
        for(var x=0; x<questionLength; x++){
            var question = questionContainer.children[x];
            if(question.next < question.position.y && !question.complete){
                question.complete = true;
                createQuestion();
            }
            question.position.y += question.speed / 10;
            if(question.position.y >= stageHeight * 0.9){
                gameOver();
            }
        }
        
        answerText.text = "Answer: "+answer;
        scoreText.text = "Score: "+score;
    }
    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}

/* For keyboard press */
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;
    var pressed = false;

    switch(e.keyCode){
        case 48:
            pressed = '0';
            break;
        case 49:
            pressed = '1';
            break;
        case 50:
            pressed = '2';
            break;
        case 51:
            pressed = '3';
            break;
        case 52:
            pressed = '4';
            break;
        case 53:
            pressed = '5';
            break;
        case 54:
            pressed = '6';
            break;
        case 55:
            pressed = '7';
            break;
        case 56:
            pressed = '8';
            break;
        case 57:
            pressed = '9';
            break;
        case 96:
            pressed = '0';
            break;
        case 97:
            pressed = '1';
            break;
        case 98:
            pressed = '2';
            break;
        case 99:
            pressed = '3';
            break;
        case 100:
            pressed = '4';
            break;
        case 101:
            pressed = '5';
            break;
        case 102:
            pressed = '6';
            break;
        case 103:
            pressed = '7';
            break;
        case 104:
            pressed = '8';
            break;
        case 105:
            pressed = '9';
            break;
        case 13:
            fire();
            break;
        case 8:
            e.preventDefault();
            backDown();
            break;
    }

    if(pressed){
        answer += pressed;
        console.log(answer);

        if(parseInt(answer) < 1){
            answer = "0";
        }

        if(answer === "0"){
            answer = "" + pressed;
        }
    }        
}

function numDown (eventData) {
    answer += eventData.target.number;
    if(parseInt(answer) < 1){
        answer = "0";
    }

    if(answer === "0"){
        answer = "" + eventData.target.number;
    }
}

function backDown(eventData){
    answer = answer.slice(0, -1);
}

function fire(){
    var length = questionContainer.children.length;
    var check = false;
    for(var x=0; x<length; x++){
        if(!check){
            if(questionContainer.children[x].answer === parseInt(answer)){
                questionContainer.removeChild(questionContainer.children[x]);
                check = true;
                score += 3;
            }
            else{
                score--;
            }
        }
        else{
            break;
        }
    }
    answer = "";
}


function startGame(){
    stage.removeChildren();
    start = true;
    score = 0;
    answer = "";

    stage.addChild(questionContainer);
    stage.addChild(numContainer);
    stage.addChild(snowContainer);
    stage.addChild(backspace);
    stage.addChild(scoreText);
    stage.addChild(answerText);
    stage.addChild(enter);
}

function gameOver(){
    questionContainer.removeChildren();
    stage.removeChildren();
    start = false;

    var text = new PIXI.Text('GAME OVER',{font : '48px Arial', fill : 0xff1010, align : 'center'});
    text.position.x = stageWidth / 2;
    text.position.y = stageHeight / 2.5;
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;

    var restart = new PIXI.Text('RESTART',{font : '48px Arial', fill : 0xff1010, align : 'center'});
    restart.position.x = stageWidth / 2;
    restart.position.y = stageHeight / 1.5;
    restart.anchor.x = 0.5;
    restart.anchor.y = 0.5;
    restart.interactive = true;
    restart.on('mousedown', startGame);
    restart.on('touchstart', startGame);

    stage.addChild(snowContainer);
    stage.addChild(text);
    stage.addChild(restart);
}

function createQuestion(){
    var firstDigit = randomInt(1, 9);
    var secondDigit = randomInt(1, 9);
    var arithOperator = randomInt(1, 4);
    var arithmetic = "";
    var result = 0;
    var speed = randomInt(5, 15);
    var positionX = randomInt(50, 700);
    var next = randomInt(100,250);
    var complete = false;

    switch(arithOperator){
        case 1:
            problem = firstDigit + '+' + secondDigit;
            result = firstDigit + secondDigit;
            break;
        case 2:
            big = Math.max(firstDigit, secondDigit);
            small = Math.min(firstDigit, secondDigit);
            firstDigit = big;
            secondDigit = small;
            problem = firstDigit + '-' + secondDigit;
            result = firstDigit - secondDigit;
            break;
        case 3:
            problem = firstDigit + 'x' + secondDigit;
            result = firstDigit * secondDigit;
            break;
        case 4:
            big = Math.max(firstDigit, secondDigit);
            small = Math.min(firstDigit, secondDigit);
            multiplied = big * small;
            problem = multiplied + '/' + secondDigit;
            result = firstDigit;
            break;
    }

    var question = new PIXI.Text(problem,{font : '24px Arial', fill : 0xff1010, align : 'center'});
    question.position.x = positionX;
    question.position.y = 0;
    question.anchor.x = 0.5;
    question.anchor.y = 0.5;
    question.speed = speed;
    question.answer = result;
    question.next = next;
    question.complete = complete;

    questionContainer.addChild(question);
}


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

function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
