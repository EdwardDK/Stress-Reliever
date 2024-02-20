

function start(){
    const config={
        dotMinRad:5,
        dotMaxRad:20,
        defColor: "rgba(10,206,250,0.9)",
        massFactor:0.002,
        smooth: 0.95,
        sphereRad: 300,
        bigDotRad: 35,
        mouseSize: 110,

    }
    const TWO_PI=Math.PI*2
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    let h;
    let w;
   let mouse;
   let dots;

    class Dot{

        constructor(r) {
            this.pos= {x:mouse.x, y:mouse.y}
            this.vel={x:0,y:0}
            this.rad=random(config.dotMinRad,config.dotMaxRad)
            this.mass=this.rad*config.massFactor
            this.color= config.defColor
            this.rad=r||random(config.dotMinRad,config.dotMaxRad)
        }

        draw(x,y){
        createCircle(this.pos.x,this.pos.y,this.rad,true,this.color)
        createCircle(this.pos.x,this.pos.y,this.rad,false,config.defColor)
            this.pos.x=x||this.pos.x+this.vel.x
            this.pos.y=y||this.pos.y+this.vel.y
    }
}

function updateDots(){


        for(let i=1;i<dots.length;i++){
            let acc={x:0,y:0}
            for(let j=0;j<dots.length;j++){

               if(i==j) continue;
               let a=dots[i]
                let b=dots[j]
                let delta={x:b.pos.x-a.pos.x,y:b.pos.y-a.pos.y}
                let dist=Math.sqrt(delta.x*delta.x+delta.y*delta.y)||1
                let force=(dist-config.sphereRad)/dist*b.mass

                if (j === 0) {
                    let alpha = config.mouseSize / dist;
                    a.color = `rgba(250, 10, 30, ${alpha})`;
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
    function createCircle(x,y,rad,fill,color){

        ctx.fillStyle=ctx.strokeStyle=color;
        ctx.beginPath()
        ctx.arc(x,y,rad,0,TWO_PI)

        ctx.closePath()
        if(fill===true){
            ctx.fill()
        }
        else{
            ctx.stroke()
        }
    }




    function random(min,max){
        return Math.random()*(max-min)+min
    }

    function init(){

        w=canvas.width=innerWidth;
        h=canvas.height=innerHeight;

        mouse={x:w/2,y:h/2, down:false}
        dots=[];
        dots.push(new Dot(config.bigDotRad))
        

    }


    function loop(){
        ctx.clearRect(0,0,w,h)
        if(mouse.down){
            dots.push(new Dot())
        }
        updateDots()

        window.requestAnimationFrame(loop)
    }
    init()
    loop()
        function setPos({layerX,layerY}){
        mouse.x=layerX;
        mouse.y=layerY;
    }

    function isDown(){
        mouse.down=!mouse.down
        console.log("x-"+ mouse.x);
        console.log("y-"+ mouse.y);
    }
        canvas.addEventListener("mousemove",setPos)
    
window.addEventListener("mousedown", isDown);
    window.addEventListener("mouseup", isDown);
}

start()