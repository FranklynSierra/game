


const canvas=document.querySelector("canvas")

const c=canvas.getContext("2d")


canvas.width=innerWidth;
canvas.height=innerHeight;
const scorEl=document.querySelector("#scorEl")
const startGameBtn=document.querySelector("#startGamebtn")
const modalEl=document.querySelector("#modalEl")
const bigScoreEl=document.querySelector("#bigScoreEl")


class Player{
  constructor(x,y,radius,color){
      this.x =x;
      this.y=y  ;
      this.radius=radius;
      this.color=color;


  }


  draw(){

     c.beginPath()
     c.arc(this.x,this.y,this.radius,Math.PI*2, false)
      c.fillStyle=this.color;
      c.fill();
  }
}


class Projectile{

	constructor(x,y,radius,color,velocity){

		this.x=x;
		this.y=y;
		this.radius=radius;
		this.color=color;
		this.velocity=velocity;
		this.alpha=1;
	}

  draw(){
      c.save()
      c.globalAlpha=this.alpha
     c.beginPath()
     c.arc(this.x,this.y,this.radius,Math.PI*2, false)
      c.fillStyle=this.color;
      c.fill();
      c.restore();
  }
  update(){

      this.draw()
  	this.x=this.x+this.velocity.x ;
  	this.y=this.y+this.velocity.y;
  	this.alpha-=0.01;
  }
}
class Enemy{

	constructor(x,y,radius,color,velocity){

		this.x=x
		this.y=y
		this.radius=radius
		this.color=color
		this.velocity=velocity
	}

  draw(){

     c.beginPath()
     c.arc(this.x,this.y,this.radius,Math.PI*2, false)
      c.fillStyle=this.color;
      c.fill();
  }
  update(){

      this.draw()
  	this.x=this.x+this.velocity.x 
  	this.y=this.y+this.velocity.y
  }
}

const friction=0.99;
class Particle{

	constructor(x,y,radius,color,velocity){

		this.x=x
		this.y=y
		this.radius=radius
		this.color=color
		this.velocity=velocity
	}

  draw(){

     c.beginPath()
     c.arc(this.x,this.y,this.radius,Math.PI*2, false)
      c.fillStyle=this.color;
      c.fill();
  }
  update(){
   
    this.draw()
    this.velocity.x*=friction
    this.velocity.y*=friction
  	this.x=this.x+this.velocity.x 
  	this.y=this.y+this.velocity.y
  }
}

const x=canvas.width/2;
const y=canvas.height/2


let player=new Player(x,y,10,'white');
let projectiles=[]
let enemies=[]
let particles=[]

function init(){

 player=new Player(x,y,10,'white');
 projectiles=[]
 enemies=[]
 particles=[]
 score=0;


}
function spawnEnemies(){

	setInterval(()=>{


				const radius=Math.random()*(30-4)+4 
     let y ;
     let x;
				if(Math.random()<0.5){
	    x=Math.random()<0.5?0-radius:canvas.width+radius;
	     y=Math.random()*canvas.height;
		  // y=Math.random()<0.5?0-radius:canvas.height+radius
    }else{
         x=Math.random()*canvas.width
	  
		  y=Math.random()<0.5?0-radius:canvas.height+radius

    }
		const color=`hsl(${Math.random()*360},50%,50%)`;

const angle=Math.atan2(
	canvas.height/2-y,
	canvas.width/2-x)

const velocity={
  x:Math.cos(angle),
  y:Math.sin(angle)


}

		enemies.push(new Enemy(x,y,radius,color,velocity))
		
	},1000)
}


let animationId
let score=0
function animate(){
	animationId=requestAnimationFrame(animate)

c.fillStyle='rgba(0,0,0,0.1)';
	c.fillRect(0,0,canvas.width,canvas.height)
particles.forEach((particle,index)=>{
if (particle.alpha<=0) {
	particles.splice(index,1)
}else{
	particle.update()
}
})
projectiles.forEach((projectile,index)=>{
	projectile.update()
player.draw()
	//remover bordes de la pantalla
	if (projectile.x + projectile.radius<0||
		projectile.x-projectile>canvas.width||
		projectile.y+projectile<0||
		projectile.y-projectile>canvas.height) {

    setTimeout(()=>{

  
    	projectiles.splice(index,1)
  		},0)

	}


})
enemies.forEach((enemy,index)=>{
	enemy.update()

  	const dist=Math.hypot(player.x-enemy.x,
  		player.y-enemy.y)
    //juego terminado
  		if(dist-enemy.radius-player.radius<1){
       cancelAnimationFrame(animationId)
       modalEl.style.display="flex"
       bigScoreEl.innerHTML=score

  		}
  projectiles.forEach((projectile,projectileIndex)=>{


  	const dist=Math.hypot(projectile.x-enemy.x,
  		projectile.y-enemy.y)
  	 	//cunndo tocamos a los enemigos

  	if(dist-enemy.radius-projectile.radius<1){
           //explociones




           //crecer nuestro puntaje
           score+=100
           scorEl.innerHTML=score
           console.log(score)

         for (let i = 0; i <enemy.radius*2; i++) {
         	particles.push(
             new Particle(projectile.x,projectile.y,Math.random()*2,enemy.color,{

             	x:(Math.random()-0.5)*(Math.random()*8),
             	y:(Math.random()-0.5)*(Math.random()*8),
             })
         		)
         }
  	if (enemy.radius-10>5) {


  		gsap.to(enemy,{

  			radius:enemy.radius-10
  		})
  		setTimeout(()=>{

  
    	projectiles.splice(projectileIndex,1)
  		},0)


  	}else{
     //remover de la escena para siempre
     score+=250
     scorEl.innerHTML=score
  		setTimeout(()=>{

  		enemies.splice(index,1)
    	projectiles.splice(projectileIndex,1)
  		},0)

  	

  	}
  	}
  })


})
}







addEventListener("click",(event)=>{
console.log(projectiles)
const angle=Math.atan2(
	event.clientY-canvas.height/2,
	event.clientX-canvas.width/2)

const velocity={
  x:Math.cos(angle)*5,
  y:Math.sin(angle)*5


}

projectiles.push(new Projectile(canvas.width/2,canvas.height/2,5,'white',velocity)
)
})
 startGameBtn.addEventListener("click",()=>{
init()
animate()

spawnEnemies()
modalEl.style.display='none'



})


