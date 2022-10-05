//----------------------------------------------------------------Background Canvas
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

//-----------------------------------------------------------------Raven Canvas

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 0;
ctx.font = '50px Impact';

let ravens = [];
//----------------------------------------------------------------Class Raven Constructor
class Raven {
    constructor(){
        this.spriteWidth = 271; //overall width of sprite sheet divided by amount of sprites on the sheet // width = 1626 /6 sprites = 271px
        this.spriteHeight = 194; //total height of the sprite sheet
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 3 + 3;
        this.directionY = Math.random() * 2 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = '/img/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor
                            (Math.random() * 255),              //Green
                            Math.floor(Math.random() * 255),    //Red
                            Math.floor(Math.random() * 255)];   //Blue
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1]
        + ',' +this.randomColors[2] + ')';
    }
//----------------------------------------------------------------Raven Update
    update(deltatime) {
        if (this.y < 0 || this.y > canvas.height - this.height){
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltatime;
        if ( this.timeSinceFlap > this.flapInterval){
        if (this.frame > this.maxFrame) this.frame = 0;
        else this.frame++;
        this.timeSinceFlap = 0;
    }
}

//----------------------------------------------------------------Raven Draw
    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(
            this.image, 
            this.frame * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width,
            this.height);
        this.height;
    }
}
//----------------------------------------------------------------Explosion Class Constructor
let explosions = [];
class Explosion {
    constructor(x,y,size){
        this.image = new Image();
        this.image.src = '/img/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = '/boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }
//----------------------------------------------------------------Explosion Update

    update(deltatime){
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            if (this.frame > 5) this.markedForDeletion = true;
        }
    }
//----------------------------------------------------------------Explosion Draw

    draw(){
        ctx.drawImage(
            this.image,
            this.frame * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.size,
            this.size);
    }
}
//----------------------------------------------------------------Score Function

function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score:' + score, 50,75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score:' + score, 55,80);
    }

//----------------------------------------------------------------Event Listener

window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.x,e.y,1,1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    ravens.forEach(object => {
        if (object.randomColors[0] === pc[0] && 
            object.randomColors[1] === pc[1] && 
            object.randomColors[2] === pc[2]) {
                //Collision Detected
                object.markedForDeletion = true;
                score++;
                explosions.push(new Explosion(object.x,object.y,object.width));
                console.log(explosions);
            }
    });
});


//----------------------------------------------------------------Animate Function
function animate(timestamp){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;
    if (timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a,b,){
            return a.width - b.width;
        })
    };
    drawScore();
    //array literal // spread operator
    //cycles through entire array and triggers update
    [...ravens, ...explosions].forEach(object => object.update(deltatime));
    [...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion)
    requestAnimationFrame(animate);
}
animate(0);