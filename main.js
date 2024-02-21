
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const body=document.querySelector("body")
const header=document.querySelector("#header")
const button=document.querySelector("#choose")
const second=document.querySelector("h2")

const choosing=document.getElementById("chosen")
const select=document.getElementById("choice")
const minDot=document.getElementById("minDot")


function mouseUp() {
    let color=select.value

}

function choose() {

    if (canvas.style.display === "none") {
        canvas.style.display = "block";
        header.style.display= "none";
        button.style.display= "none";
        second.style.display= "none";
        body.style.cursor = "none";
        select.style.display="none";
        choosing.style.display= "none";

    } else {
        canvas.style.display = "none";
        header.style.display= "block";
        button.style.display= "block";
        second.style.display= "block";
        body.style.cursor = "default";
        select.style.display="block";
        choosing.style.display= "block";

    }

    start()
}

function start(){
    let color=select.value;
    const config={
        dotMinRad:minDot.value,
        dotMaxRad:20,
        defColor: color,
        massFactor:0.002,
        smooth: 0.65,
        sphereRad: 300,
        bigDotRad: 35,
        mouseSize: 120 ,
    }
    const TWO_PI = 2 * Math.PI;

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    let w, h, mouse, dots;

    class Dot {
        constructor(r) {
            this.pos = {
                x: mouse.x,
                y: mouse.y
            };
            this.vel = {
                x: 0,
                y: 0
            };
            this.rad = r || random(config.dotMinRad, config.dotMaxRad);
            this.mass = this.rad * config.massFactor;
            this.color = config.defColor;
        }

        draw(x, y) {
            this.pos.x = x || this.pos.x + this.vel.x;
            this.pos.y = y || this.pos.y + this.vel.y;
            createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
            createCircle(this.pos.x, this.pos.y, this.rad, false, config.defColor);
        }
    }

    function updateDots() {
        for (let i = 1; i < dots.length; i++) {
            let acc = { x: 0, y: 0 };

            for (let j = 0; j < dots.length; j++) {
                if (i === j) continue;
                let [a, b] = [dots[i], dots[j]];

                let delta = {
                    x: b.pos.x - a.pos.x,
                    y: b.pos.y - a.pos.y
                };
                let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
                let force = (dist - config.sphereRad) / dist * b.mass;

                if (j === 0) {
                    let alpha = config.mouseSize / dist;
                    a.color = `rgba(189, 183, 107, ${alpha})`;
                    dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
                }

                acc.x += delta.x * force;
                acc.y += delta.y * force;
            }

            dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
            dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
        }

        dots.map(e => e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw());
    }

    function createCircle(x, y, rad, fill, color) {
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, TWO_PI);
        ctx.closePath();
        fill ? ctx.fill() : ctx.stroke();
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function init() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;

        mouse = {
            x: w / 2,
            y: h / 2,
            down: false
        };

        dots = [];

        dots.push(new Dot(config.bigDotRad));
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);

        if (mouse.down) {
            dots.push(new Dot());
        }

        updateDots();

        window.requestAnimationFrame(loop);
    }

    init();
    loop();

    function setPos({ layerX, layerY }) {
        [mouse.x, mouse.y] = [layerX, layerY];
    }

    function isDown() {
        mouse.down = !mouse.down;
    }

    canvas.addEventListener('mousemove', setPos);
    window.addEventListener('mousedown', isDown);
    window.addEventListener('mouseup', isDown);
}