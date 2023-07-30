class projectile extends entity{
    constructor(layer,x,y,type,team,direction,damage,damageType){
        super(layer,x,y,type)
        this.team=team
        this.direction=direction
        this.damage=damage
        this.damageType=damageType
        this.used=false
        switch(this.type){
            case 1:
                this.timer=120
                this.speed=5
                this.size=2
            break
            case 2:
                this.timer=360
                this.speed=2
                this.size=10
            break
            case 3:
                this.timer=360
                this.speed=3
                this.size=12
            break
        }
    }
    display(){
        this.layer.push()
        this.layer.translate(this.position.x,this.position.y)
        this.layer.rotate(this.direction)
        switch(this.type){
            case 1:
                this.layer.fill(40,this.fade)
                this.layer.rect(0,0,3,6)
            break
            case 2:
                this.layer.fill(255,150,0,this.fade)
                this.layer.ellipse(0,0,20)
            break
            case 3:
                this.layer.fill(0,this.fade)
                this.layer.ellipse(0,0,24)
            break
        }
        this.layer.pop()
    }
    update(){
        super.update()
        this.fade=smoothAnim(this.fade,this.timer>0&&!this.used,0,1,5)
        this.timer--
        this.position.x+=lsin(this.direction)*this.speed
        this.position.y-=lcos(this.direction)*this.speed
        switch(this.type){
            case 2:
                if(this.time%30==0){
                    entities.particles.push(new particle(this.layer,this.position.x,this.position.y,1,[30,30,30],1,random(0,360)))
                }
            break
            case 3:
                if(this.time%15==0){
                    entities.particles.push(new particle(this.layer,this.position.x,this.position.y,8,[0,0,0],1,random(0,360)))
                }
            break
        }
        if(!this.used){
            if(this.team==0){
                for(let a=0,la=entities.towers.length;a<la;a++){
                    if(dist(entities.towers[a].position.x,entities.towers[a].position.y,this.position.x,this.position.y)<this.size+entities.towers[a].size&&!this.used){
                        switch(this.type){
                            case 1:
                                this.used=true
                            break
                        }
                        entities.towers[a].applyStun(this.damage,this.damageType)
                    }
                }
            }else if(this.team==1){
                for(let a=0,la=entities.enemies.length;a<la;a++){
                    if(dist(entities.enemies[a].position.x,entities.enemies[a].position.y,this.position.x,this.position.y)<this.size+12*entities.enemies[a].size&&!this.used){
                        this.used=true
                        entities.enemies[a].takeDamage(this.damage,this.damageType)
                    }
                }
            }
        }
        if((this.used||this.timer<=0)&&this.fade<=0){
            this.remove=true
        }
    }
}