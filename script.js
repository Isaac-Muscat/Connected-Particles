const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const RandInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const RandDir = () => {
    const num = Math.random();
    return num > 0.5 ?  1 : -1;
}

let mousePos = {
    x: 0,
    y: 0
}

class Particle {
    constructor(x, y, r, c) {
        this.mouseRad = 200;
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = c;
        this.speed = 2;
        this.velocity = {x: this.speed*RandDir(), y: this.speed*RandDir()};
    }
    draw(){
        context.fillStyle = this.c;
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        context.fill();
    }

    update(){
        const dist = Math.sqrt(this.squareDist(mousePos));
        if( dist < this.mouseRad) {
            if(mousePos.x < this.x) this.velocity.x = this.speed*this.mouseRad/dist;
            if(mousePos.x > this.x) this.velocity.x = this.speed*-this.mouseRad/dist;
            if(mousePos.y < this.y) this.velocity.y = this.speed*this.mouseRad/dist;
            if(mousePos.y > this.y) this.velocity.y = this.speed*-this.mouseRad/dist;
        }
        if(this.x > canvas.width) this.velocity.x = -this.speed;
        if(this.y > canvas.height) this.velocity.y = -this.speed;
        if(this.x < 0) this.velocity.x = this.speed;
        if(this.y < 0) this.velocity.y = this.speed;
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }
    squareDist(p1){
        return Math.pow(p1.x-this.x,2) + Math.pow(p1.y-this.y,2);
    }
}

class ParticleSystem {
    constructor(numParticles, c, r) {
        this.maxDist = 150;
        this.c = c;
        this.numParticles = numParticles;
        this.particles = [];
        for (let i = 0; i < numParticles; i++) {
            const p = new Particle(Math.random()*canvas.width, Math.random()*canvas.height, r, c);
            this.particles.push(p);
        }
    }

    connect() {
        for(let i = this.numParticles-1; i>0; i--){
            for(let j = this.numParticles-1; j>0; j--){
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dist = Math.sqrt(this.squareDistBetweenParticles(p1, p2));
                if(dist < this.maxDist) {
                    context.strokeStyle = `rgba(255, 255, 255, ${this.maxDist/(dist*10)})`;
                    context.beginPath();
                    context.moveTo(p1.x, p1.y);
                    context.lineTo(p2.x, p2.y);
                    context.stroke();
                }
            }
        }
    }
    draw() {
        for(let i = 0; i<this.numParticles; i++){
            this.particles[i].draw();
        }
    }
    update() {
        for(let i = 0; i<this.numParticles; i++){
            this.particles[i].update();
        }
    }
    squareDistBetweenParticles(p1, p2){
        return Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2);
    }
}

window.addEventListener("mousemove", e => {
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
});

window.addEventListener("resize", e => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener("mouseout", e => {
    mousePos = {x: canvas.width/2, y: canvas.height/2};
});

const system = new ParticleSystem(Math.floor(innerHeight*innerWidth/5000), 'rgba(255, 255, 255, 1)', 2);

function animate(){
    context.clearRect(0, 0, innerWidth, innerHeight);
    system.update();
    system.draw();
    system.connect();
    window.requestAnimationFrame(animate);
}


animate();