class enemy extends entity{
    constructor(layer,x,y,type,id){
        super(layer,x,y,type)
        this.id=id

        this.name=types.enemy[this.type].name
        this.life=types.enemy[this.type].life
        this.shield=types.enemy[this.type].shield
        this.defense=types.enemy[this.type].defense
        this.speed=types.enemy[this.type].speed
        this.stun=types.enemy[this.type].stun
        this.size=types.enemy[this.type].size
        this.hidden=types.enemy[this.type].hidden
        this.attachments=types.enemy[this.type].attachments
        
        this.direction=0

        this.offset={
            position:{x:0,y:0},
            life:{x:0,y:-30},
        }
        
        this.base={
            position:{x:this.position.x,y:this.position.y},
            life:this.life,
            shield:this.shield,
            speed:this.speed,
            size:this.size,
        }
        
        this.collect={
            life:this.life,
            shield:this.shield,
        }

        this.rates={
            main:0,
        }

        this.anim={
            life:1,
            size:1,
        }

        this.movement={
            path:game.path[this.id%game.path.length],
            position:0,
            progress:0,
            totalProgress:0,
        }
    }
    takeDamage(damage,typeName){
        if(damage>0){
            let effect=max(damage-this.defense,min(damage,1))
            if(this.shield>0){
                this.shield-=effect
            }else{
                this.life-=damage
            }
        }
    }
    display(){
        this.layer.push()
        this.layer.translate(this.position.x+this.offset.position.x,this.position.y+this.offset.position.x)
        this.layer.rotate(this.direction)
        this.layer.scale(this.size)
        switch(this.type){
            default:
                for(let a=0,la=this.attachments.length;a<la;a++){
                    this.layer.noStroke()
                    switch(this.attachments[a].name){
                        case 'Body':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(0,0,24,24)
                        break
                        case 'Arms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate((sin(this.rates.main*4))*20)
                            this.layer.ellipse(-15,0,12,12)
                            this.layer.ellipse(15,0,12,12)
                            this.layer.rotate((sin(this.rates.main*4))*-20)
                        break
                        case 'Legs':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(5,(sin(this.rates.main*4))*-7,12,12)
                            this.layer.ellipse(-5,(sin(this.rates.main*4))*7,12,12)
                        break
                        case 'Mouth':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.line(-4,7,4,7)
                        break
                        case 'Eyes':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(3)
                            this.layer.point(-4,2)
                            this.layer.point(4,2)
                        break
                        case 'Armchain':
                            this.layer.rotate((sin(this.rates.main*4))*20)
                            this.layer.stroke(50,this.fade)
                            this.layer.strokeWeight(1)
                            this.layer.ellipse(-16,-1.7,3,3)
                            this.layer.ellipse(-16,1.7,3,3)
                            this.layer.ellipse(-15,-5,3,3)
                            this.layer.ellipse(-15,5,3,3)
                            this.layer.ellipse(16,-1.7,3,3)
                            this.layer.ellipse(16,1.7,3,3)
                            this.layer.ellipse(15,-5,3,3)
                            this.layer.ellipse(15,5,3,3)
                            this.layer.rotate((sin(this.rates.main*4))*-20)
                        break
                    }
                }
            break
        }
        this.layer.pop()
    }
    displayInfo(){
        this.layer.push()
        this.layer.translate(this.position.x+this.offset.life.x,this.position.y+this.offset.life.y)
        this.layer.scale(this.anim.size)
        this.layer.noStroke()
        this.layer.fill(150,this.fade*this.anim.life)
        this.layer.rect(0,0,40,6,3)
        if(this.collect.life>=this.life){
            this.layer.fill(240,0,0,this.fade*this.anim.life)
            this.layer.rect((max(0,this.collect.life)/this.base.life)*20-20,0,(max(0,this.collect.life)/this.base.life)*40,2+min((max(0,this.collect.life)/this.base.life)*80,4),3)
            this.layer.fill(min(255,510-max(0,this.life)/this.base.life*510)-max(0,5-max(0,this.life)/this.base.life*30)*25,max(0,this.life)/this.base.life*510,0,this.fade*this.anim.life)
            this.layer.rect((max(0,this.life)/this.base.life)*20-20,0,(max(0,this.life)/this.base.life)*40,2+min((max(0,this.life)/this.base.life)*80,4),3)
        }else if(this.collect.life<this.life){
            this.layer.fill(240,0,0,this.fade*this.anim.life)
            this.layer.rect((max(0,this.life)/this.base.life)*20-20,0,(max(0,this.life)/this.base.life)*40,2+min((max(0,this.life)/this.base.life)*80,4),3)
            this.layer.fill(min(255,510-max(0,this.collect.life)/this.base.life*510)-max(0,5-max(0,this.collect.life)/this.base.life*30)*25,max(0,this.collect.life)/this.base.life*510,0,this.fade*this.anim.life)
            this.layer.rect((max(0,this.collect.life)/this.base.life)*20-20,0,(max(0,this.collect.life)/this.base.life)*40,2+min((max(0,this.collect.life)/this.base.life)*80,4),3)
        }
        this.layer.fill(0,this.fade*this.anim.life)
        this.layer.textSize(6)
        this.layer.text(max(0,ceil(convert(this.life)))+"/"+max(0,ceil(convert(this.base.life))),0,0.5)
        if(this.base.shield>0){
            switch(this.name){
                default:
                    this.layer.translate(0,-10)
                    this.layer.fill(150,this.fade*this.anim.shield)
                    this.layer.rect(0,0,40,6,3)
                    if(this.collect.shield>=this.shield){
                        this.layer.fill(240,0,0,this.fade*this.anim.shield)
                        this.layer.rect((max(0,this.collect.shield)/this.base.shield)*20-20,0,(max(0,this.collect.shield)/this.base.shield)*40,2+min((max(0,this.collect.shield)/this.base.shield)*80,4),3)
                        this.layer.fill(0,min(255,510-max(0,this.shield)/this.base.shield*510)-max(0,5-max(0,this.shield)/this.base.shield*30)*25,max(0,this.shield)/this.base.shield*510,this.fade*this.anim.shield)
                        this.layer.rect((max(0,this.shield)/this.base.shield)*20-20,0,(max(0,this.shield)/this.base.shield)*40,2+min((max(0,this.shield)/this.base.shield)*80,4),3)
                    }else if(this.collect.shield<this.shield){
                        this.layer.fill(240,0,0,this.fade*this.anim.shield)
                        this.layer.rect((max(0,this.shield)/this.base.shield)*20-20,0,(max(0,this.shield)/this.base.shield)*40,2+min((max(0,this.shield)/this.base.shield)*80,4),3)
                        this.layer.fill(0,min(255,510-max(0,this.collect.shield)/this.base.shield*510)-max(0,5-max(0,this.collect.shield)/this.base.shield*30)*25,max(0,this.collect.shield)/this.base.shield*510,this.fade*this.anim.shield)
                        this.layer.rect((max(0,this.collect.shield)/this.base.shield)*20-20,0,(max(0,this.collect.shield)/this.base.shield)*40,2+min((max(0,this.collect.shield)/this.base.shield)*80,4),3)
                    }
                    this.layer.fill(0,this.fade*this.anim.shield)
                    this.layer.textSize(6)
                    this.layer.text(max(0,ceil(convert(this.shield)))+"/"+max(0,ceil(convert(this.base.shield))),0,0.5)
                break
            }
        }
        this.layer.pop()
    }
    update(){
        super.update()
        this.collect.life=this.collect.life*0.8+this.life*0.2
        if(this.base.shield>0){
            this.collect.shield=this.collect.shield*0.8+this.shield*0.2
        }
        if(this.life>0){
            if(this.fade<1){
                this.fade=round(this.fade*15+1)/15
            }
            this.rates.main+=this.speed
            this.movement.progress+=this.speed
            this.movement.totalProgress+=this.speed
            this.anim.size=smoothAnim(this.anim.size,dist(inputs.rel.x,inputs.rel.y,this.position.x,this.position.y)<this.size*15,1,1.5,5)
            switch(this.movement.path[this.movement.position]){
                case 'D':
                    this.position.y+=this.speed
                break
                case 'U':
                    this.position.y-=this.speed
                break
                case 'R':
                    this.position.x+=this.speed
                break
                case 'L':
                    this.position.x-=this.speed
                break
                case 'T':
                    this.movement.progress+=this.speed
                    this.movement.totalProgress+=this.speed
                    if(this.movement.path[this.movement.position-1]=='D'&&this.movement.path[this.movement.position+1]=='R'||
                    this.movement.path[this.movement.position-1]=='R'&&this.movement.path[this.movement.position+1]=='U'||
                    this.movement.path[this.movement.position-1]=='U'&&this.movement.path[this.movement.position+1]=='L'||
                    this.movement.path[this.movement.position-1]=='L'&&this.movement.path[this.movement.position+1]=='D'){
                        this.direction-=this.speed*18/5
                    }else{
                        this.direction+=this.speed*18/5
                    }
                break
            }
            if(this.movement.progress>=50){
                this.movement.position++
                this.movement.progress-=50
                this.position.x=round(this.position.x/50)*50
                this.position.y=round(this.position.y/50)*50
                this.direction=round(this.direction/90)*90
            }
        }else{
            if(this.fade>0){
                this.fade=round(this.fade*15-1)/15
                this.size*=1.01
            }else{
                this.remove=true
            }
        }
    }
}