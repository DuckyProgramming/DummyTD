class enemy extends entity{
    constructor(layer,x,y,type,id,movement,snap){
        super(layer,x,y,type)
        this.id=id
        this.snap=snap
        if(this.snap==undefined){
            this.snap=true
        }

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

        this.trigger={
            death:false,
        }
        
        this.base={
            position:{x:this.position.x,y:this.position.y},
            life:this.life,
            shield:this.shield,
            speed:this.speed,
            size:this.size,
        }

        this.recall={
            speed:this.speed,
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

        this.movement=movement
        
        if(this.movement==undefined){
            this.movement={
                path:game.path[this.id%game.path.length],
                position:0,
                progress:0,
                totalProgress:0,
            }
        }

        switch(this.name){
            case 'Mystery':
                this.spawns=['Normal','Quick','Hefty','Hidden']
            break
            case 'Fallen Reaper':
                this.spawns=['Normal','Quick','Hefty','Hidden']
                this.anim.hand=0
                this.operation={timer:0}
            break
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
    summonPosition(number,variance,possibilities){
        for(let a=0,la=number;a<la;a++){
            entities.enemies.push(new enemy(this.layer,this.position.x+random(-variance,variance),this.position.y+random(-variance,variance),findName(possibilities[floor(random(0,possibilities.length-1))],types.enemy),this.id,{
                path:this.movement.path,
                position:this.movement.position,
                progress:this.movement.progress,
                totalProgress:this.movement.totalProgress-50,
            },false))
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
                            this.layer.rotate((lsin(this.rates.main*4))*20)
                            this.layer.ellipse(-15,0,12,12)
                            this.layer.ellipse(15,0,12,12)
                            this.layer.rotate((lsin(this.rates.main*4))*-20)
                        break
                        case 'Legs':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(5,(lsin(this.rates.main*4))*-7,12,12)
                            this.layer.ellipse(-5,(lsin(this.rates.main*4))*7,12,12)
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
                            this.layer.rotate((lsin(this.rates.main*4))*20)
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
                            this.layer.rotate((lsin(this.rates.main*4))*-20)
                        break
                        case 'Body-Transparent':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.ellipse(0,0,24,24)
                        break
                        case 'Arms-Transparent':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.rotate((lsin(this.rates.main*4))*20)
                            this.layer.ellipse(-15,0,12,12)
                            this.layer.ellipse(15,0,12,12)
                            this.layer.rotate((lsin(this.rates.main*4))*-20)
                        break
                        case 'Legs-Transparent':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.ellipse(5,(lsin(this.rates.main*4))*-7,12,12)
                            this.layer.ellipse(-5,(lsin(this.rates.main*4))*7,12,12)
                        break
                        case 'Mouth-Transparent':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.strokeWeight(2)
                            this.layer.line(-4,7,4,7)
                        break
                        case 'Eyes-Transparent':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.strokeWeight(3)
                            this.layer.point(-4,2)
                            this.layer.point(4,2)
                        break
                        case 'Question-Transparent':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.noStroke()
                            this.layer.textSize(25)
                            this.layer.text("?",0,2)
                        break
                        case 'Body-Varying':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*map(constrain(this.life/this.base.life,0,1),0,1,this.attachments[a].color[3],this.attachments[a].color[4]))
                            this.layer.ellipse(0,0,25,25)
                        break
                        case 'Arms-Varying':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*map(constrain(this.life/this.base.life,0,1),0,1,this.attachments[a].color[3],this.attachments[a].color[4]))
                            this.layer.rotate((lsin(this.rates.main*4))*20)
                            this.layer.ellipse(-15,0,13,13)
                            this.layer.ellipse(15,0,13,13)
                            this.layer.rotate((lsin(this.rates.main*4))*-20)
                        break
                        case 'Legs-Varying':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*map(constrain(this.life/this.base.life,0,1),0,1,this.attachments[a].color[3],this.attachments[a].color[4]))
                            this.layer.ellipse(5,(lsin(this.rates.main*4))*-7,13,13)
                            this.layer.ellipse(-5,(lsin(this.rates.main*4))*7,13,13)
                        break
                        case 'BodyDiamondPlate-Varying':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*map(constrain(this.life/this.base.life,0,1),0,1,this.attachments[a].color[3],this.attachments[a].color[4]))
                            this.layer.rotate(45)
                            this.layer.ellipse(0,0,6.5,2)
                            this.layer.ellipse(-5.5,0,2,6.5)
                            this.layer.ellipse(5.5,0,2,6.5)
                            this.layer.ellipse(0,5.5,2,6.5)
                            this.layer.ellipse(0,-5.5,2,6.5)
                            this.layer.ellipse(-5.5,-5.5,6.5,2)
                            this.layer.ellipse(5.5,-5.5,6.5,2)
                            this.layer.ellipse(-5.5,5.5,6.5,2)
                            this.layer.ellipse(5.5,5.5,6.5,2)
                            this.layer.arc(11,0,6.5,2,90,270)
                            this.layer.arc(-11,0,6.5,2,-90,90)
                            this.layer.ellipse(0,11,6.5,2)
                            this.layer.ellipse(0,-11,6.5,2)
                            this.layer.rotate(-45)
                        break
                        case 'ArmsDiamondPlate-Varying':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*map(constrain(this.life/this.base.life,0,1),0,1,this.attachments[a].color[3],this.attachments[a].color[4]))
                            this.layer.rotate((lsin(this.rates.main*4))*20+45)
                            this.layer.ellipse(-10.5,10.5,6.5,2.5)
                            this.layer.ellipse(10.5,-10.5,6.5,2.5)
                            this.layer.ellipse(-5.5,10.5,2,8)
                            this.layer.ellipse(-15.5,10.5,2,8)
                            this.layer.ellipse(5.5,-10.5,2,8)
                            this.layer.ellipse(15.5,-10.5,2,8)
                            this.layer.arc(-10.5,5.5,2,6.5,0,180)
                            this.layer.arc(-10.5,15.5,2,6.5,-180,0)
                            this.layer.arc(10.5,-5.5,2,6.5,-180,0)
                            this.layer.arc(10.5,-15.5,2,6.5,0,180)
                            this.layer.rotate((lsin(this.rates.main*4))*-20-45)
                        break
                        case 'Cloak':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.arc(0,0,26,26,-210,30)
                        break
                        case 'Scythe':
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.rotate((lsin(this.rates.main*4))*20)
                            this.layer.line(-15,this.anim.hand,-15,20+this.anim.hand)
                            this.layer.noStroke()
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.triangle(-14,20+this.anim.hand,-14,14+this.anim.hand,-2,15+this.anim.hand)
                            this.layer.rotate((lsin(this.rates.main*4))*-20)
                        break
                        case 'OneMovedArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate((lsin(this.rates.main*4))*20)
                            this.layer.ellipse(-15,this.anim.hand,12,12)
                            this.layer.ellipse(15,0,12,12)
                            this.layer.rotate((lsin(this.rates.main*4))*-20)
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
                    this.direction=0
                break
                case 'U':
                    this.position.y-=this.speed
                    this.direction=180
                break
                case 'R':
                    this.position.x+=this.speed
                    this.direction=270
                break
                case 'L':
                    this.position.x-=this.speed
                    this.direction=90
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
                if(this.snap){
                    this.position.x=round(this.position.x/50)*50
                    this.position.y=round(this.position.y/50)*50
                }
                this.direction=round(this.direction/90)*90
            }
            switch(this.name){
                case 'Hidden':
                    if(this.time%15==0){
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,1,[65,65,65],this.size,random(0,360)))
                    }
                break
            }
            switch(this.name){
                case 'Fallen Reaper':
                    this.operation.timer--
                    if(this.operation.timer<=0){
                        this.operation.timer=510
                    }
                    if(this.operation.timer>450){
                        this.anim.hand+=this.operation.timer>480?0.35:-0.35
                        this.speed=0
                        if(this.operation.timer==480){
                            this.summonPosition(floor(random(2,4)),30,this.spawns)
                        }
                    }
                    else{
                        this.speed=this.recall.speed
                        this.anim.hand=0
                    }
                break
            }
        }else{
            if(!this.trigger.death){
                switch(this.name){
                    case 'Mystery':
                        entities.enemies.push(new enemy(this.layer,this.position.x,this.position.y,findName(this.spawns[floor(random(0,this.spawns.length-1))],types.enemy),this.id,{
                            path:this.movement.path,
                            position:this.movement.position,
                            progress:this.movement.progress,
                            totalProgress:this.movement.totalProgress-50,
                        }))
                    break
                }
                this.trigger.death=true
            }
            if(this.fade>0){
                this.fade=round(this.fade*15-1)/15
                this.size*=1.01
            }else{
                this.remove=true
            }
        }
    }
}