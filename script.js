const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];
//----------------------------------------------------------------Class Raven
class Raven {
    constructor(){
        this.width = 100;
        this.height = 100;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;

    }
//----------------------------------------------------------------Update Function
    update() {
        this.x -= this.directionX;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
    }
//----------------------------------------------------------------Draw Function
    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


//----------------------------------------------------------------Animate Function
function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;
    if (timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
    };
    //array literal // spread operator
    //cycles through entire array and triggers update
    [...ravens].forEach(object => object.update());
    [...ravens].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion)
    requestAnimationFrame(animate);
}
animate(0);