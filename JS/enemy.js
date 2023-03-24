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
        
        this.base={
            position:{x:this.position.x,y:this.position.y},
            life:this.life,
            speed:this.speed,
            size:this.size,
        }
        
        this.collect={
            life:this.life,
        }

        this.rates={
            main:0,
        }

        this.anim={
            life:1,
        }

        this.movement={
            path:game.path[this.id%game.path.length],
            position:0,
            progress:0,
        }
    }
    display(){
        this.layer.push()
        this.layer.translate(this.position.x,this.position.y)
        this.layer.rotate(this.direction)
        this.layer.scale(this.size)
        switch(this.type){
            default:
                for(let a=0,la=this.attachments.length;a<la;a++){
                    this.layer.noStroke()
                    switch(this.attachments[a].name){
                        case 'Body':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(0,0,30,30)
                        break
                        case 'Arms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate((sin(this.rates.main*4))*20)
                            this.layer.ellipse(-18,0,16,16)
                            this.layer.ellipse(18,0,16,16)
                            this.layer.rotate((sin(this.rates.main*4))*-20)
                        break
                        case 'Legs':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(6,((sin(this.rates.main*4))*-9),14,14)
                            this.layer.ellipse(-6,((sin(this.rates.main*4))*9),14,14)
                        break
                        case 'Mouth':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(3)
                            this.layer.line(-5,9,5,9)
                        break
                        case 'Eyes':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(4)
                            this.layer.point(-5,2)
                            this.layer.point(5,2)
                        break
                    }
                }
            break
        }
        this.layer.pop()
    }
    displayInfo(){
        this.layer.push()
        this.layer.translate(this.position.x,this.position.y-25)
        this.layer.noStroke()
        this.layer.fill(150,this.fade*this.anim.life)
        this.layer.rect(0,0,40,6,3)
        if(this.collect.life>=this.life){
            this.layer.fill(240,0,0,this.fade*this.anim.life)
            this.layer.rect((max(0,this.collect.life)/this.base.life)*25-25,0,(max(0,this.collect.life)/this.base.life)*40,2+min((max(0,this.collect.life)/this.base.life)*80,4),3)
            this.layer.fill(min(255,510-max(0,this.life)/this.base.life*510)-max(0,5-max(0,this.life)/this.base.life*30)*25,max(0,this.life)/this.base.life*510,0,this.fade*this.anim.life)
            this.layer.rect((max(0,this.life)/this.base.life)*25-25,0,(max(0,this.life)/this.base.life)*40,2+min((max(0,this.life)/this.base.life)*80,4),3)
        }else if(this.collect.life<this.life){
            this.layer.fill(240,0,0,this.fade*this.anim.life)
            this.layer.rect((max(0,this.life)/this.base.life)*25-25,0,(max(0,this.life)/this.base.life)*40,2+min((max(0,this.life)/this.base.life)*80,4),3)
            this.layer.fill(min(255,510-max(0,this.collect.life)/this.base.life*510)-max(0,5-max(0,this.collect.life)/this.base.life*30)*25,max(0,this.collect.life)/this.base.life*510,0,this.fade*this.anim.life)
            this.layer.rect((max(0,this.collect.life)/this.base.life)*25-25,0,(max(0,this.collect.life)/this.base.life)*40,2+min((max(0,this.collect.life)/this.base.life)*80,4),3)
        }
        this.layer.fill(0,this.fade*this.anim.life)
        this.layer.textSize(6)
        this.layer.text(max(0,ceil(convert(this.life)))+"/"+max(0,ceil(convert(this.base.life))),0,0.5)
        this.layer.pop()
    }
    update(){
        super.update()
        if(this.life>0){
            if(this.fade<1){
                this.fade=round(this.fade*15+1)/15
            }
            this.rates.main+=this.speed
            this.movement.progress+=this.speed
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
            if(this.fade>1){
                this.fade=round(this.fade*15-1)/15
                this.size*=1.01
            }else{
                this.remove=true
            }
        }
    }
}