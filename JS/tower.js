class tower extends entity{
    constructor(layer,x,y,type,level,id){
        super(layer,x,y,type)
        this.level=level
        this.id=id

        this.name=types.tower[this.type].name
        this.size=types.tower[this.type].size
        this.effect=types.tower[this.type].levels[this.level].effect
        this.reload=types.tower[this.type].levels[this.level].reload
        this.range=types.tower[this.type].levels[this.level].range
        this.hidden=types.tower[this.type].levels[this.level].hidden

        this.direction=0
        this.scale=1
        this.reloadTimer=0
        this.selected=false
        this.selling=false

        this.anim={
            selected:0,
        }
        switch(this.name){
            case 'Scout':
                this.anim.weapon={fired:0,firetick:0}
            break
        }
    }
    display(){
        this.layer.push()
        this.layer.translate(this.position.x,this.position.y)
        this.layer.fill(0,this.fade*this.anim.selected*0.2)
        this.layer.noStroke()
        this.layer.ellipse(0,0,this.range*2)
        this.layer.rotate(this.direction)
        this.layer.scale(this.scale)
        switch(this.name){
            case 'Scout':
                this.layer.fill(0,this.fade*this.anim.weapon.fired)
                this.layer.rect(6,-516,1,1000)
                this.layer.fill(60,this.fade)
                this.layer.rect(6,-12,3,8)
                this.layer.fill(255,200,100,this.fade)
                this.layer.ellipse(0,0,24,24)
                this.layer.fill(0,this.fade)
                this.layer.ellipse(-5,-3,3)
                this.layer.ellipse(5,-3,3)
                this.layer.noFill()
                this.layer.stroke(0,this.fade)
                this.layer.strokeWeight(1)
                this.layer.arc(0,-10,12,6,30,150)
            break
        }
        this.layer.pop()
    }
    displayInfo(){
    }
    update(){
        switch(this.name){
            case 'Scout':
                if(this.anim.weapon.firetick>0){
                    this.anim.weapon.firetick--
                    this.anim.weapon.fired+=0.25
                }else if(this.anim.weapon.fired>0){
                    this.anim.weapon.fired-=0.1
                }
            break
        }
        this.fade=smoothAnim(this.fade,!this.selling,0,1,10)
        this.anim.selected=smoothAnim(this.anim.selected,this.selected,0,1,10)
        if(this.reloadTimer>0){
            this.reloadTimer--
        }else{
            for(let a=0,la=game.sortedEnemies.length;a<la;a++){
                let target=entities.enemies[game.sortedEnemies[a]]
                if(dist(this.position.x,this.position.y,target.position.x,target.position.y)<this.range+12*target.size&&!(target.hidden&&!this.hidden)){
                    target.takeDamage(this.effect[0],this.effect[1])
                    this.direction=atan2(target.position.x-this.position.x,this.position.y-target.position.y)
                    this.reloadTimer=this.reload
                    a=la
                    switch(this.name){
                        case 'Scout':
                            this.anim.weapon.firetick=4
                        break
                    }
                }
            }
        }
    }
}