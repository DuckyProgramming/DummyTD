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
        this.activated=true
        this.shieldLevel=0

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
            direction:0,
            attachments:[],
        }

        this.counters={zaps:0}

        this.movement=movement
        
        if(this.movement==undefined){
            this.movement={
                id:this.id%game.path.length,
                path:game.path[id],
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
            case 'Mystery Boss':
                this.spawns=['Normal Boss','Lead Boss','Fallen Reaper','Chained Boss','Shadow Boss','Boomer','Mega Speedy']
            break
            case 'Glitch':
                this.anim.possibilities=[[200,0,255],[0,100,200],[0,150,255],[255,150,50],[255,75,255],[50,255,50],[125,255,125],[255,255,100],[180,180,180],[255,100,100]]
            break
            case 'Templar':
                this.shieldLevel=10
                this.operation={timer:0}
            break
            case 'SCT':
                this.operation={timer:0,step:0,target:{x:0,y:0}}
            break
            case 'Soul Stealer': case 'Fallen Guardian': case 'Nuclear Guardian':
                this.anim.hand={x:0,y:0,spin:0}
                this.operation={timer:0,step:0,target:{x:0,y:0}}
            break
            case 'Summoner Boss':
                this.anim.hand=0
            break
            case 'Unknown':
                this.subs=[]
                this.operation={timer:0,step:0}
            break
            case 'Fallen Soul': case 'Gold Guard':
                this.anim.hand=0
                this.operation={timer:0,step:0}
            break
            case 'Vindicator':
                this.anim.hand={x:0,y:0,hammer:0,spin:0}
                this.operation={timer:0,step:0,target:{x:0,y:0},trigger:false}
                this.defense=40
            break
            case 'Molten Titan':
                this.anim.hand={main:0}
                this.operation={timer:0,step:0,target:{x:0,y:0},attack:0}
            break
            case 'Void Reaver': case 'Nuclear Void Reaver':
                this.anim.shield=0
                this.anim.armor=1
                this.anim.hand={main:0}
                this.operation={timer:0,step:0,target:{x:0,y:0},attack:0,shield:0,spawn:0}
                this.anim.hand={main:0}
                this.spawns=['Fallen','Chained Boss','Boomer','Mega Speedy','Mystery Boss','Circuit','Templar','Slow King','Soul','Health Cultist','Fallen Guardian','Unknown','White Balloon','Zebra Balloon']
            break
            case 'Gravekeeper':
                this.anim.hand={x:0,y:0,spin:0}
                this.operation={timer:0,step:0,target:{x:0,y:0}}
                this.spawns=['Normal','Quick','Hefty','Hidden','Mystery','Fallen','Fallen Rusher','Molten']
            break
        }
        for(let a=0,la=this.attachments.length;a<la;a++){
            switch(this.attachments[a].name){
                case 'FallenRusherArms': case 'FallenRusherShield':
                case 'TemplarShield':
                case 'GoldGuardArms': case 'GoldGuardTrident':
                case 'VindicatorArms': case 'VindicatorArmsGlow': case 'VindicatorArmbands': case 'VindicatorShield':
                    this.anim.attachments.push({main:0})
                break
                case 'Leg1Flash': case 'Leg2Flash': case 'Arm1Flash': case 'Arm2Flash': case 'BodyFlash':
                    this.anim.attachments.push({possibilities:[[200,0,255],[0,100,200],[0,150,255],[255,150,50],[255,75,255],[50,255,50],[125,255,125],[255,255,100],[180,180,180],[255,100,100]]})
                    this.attachments[a].color=this.anim.attachments[a].possibilities[floor(random(0,this.anim.attachments[a].possibilities.length))]
                break
                case 'Shocks': case 'SmallShocks':
                    this.anim.attachments.push({shocks:[[random(0,360),random(15,50),1],[random(0,360),random(15,50),0.8],[random(0,360),random(15,50),0.6],[random(0,360),random(15,50),0.4],[random(0,360),random(15,50),0.2]]})
                break
                case 'LeadBalloon':
                    this.anim.attachments.push({direction:[0,120,240],radius:24,state:0})
                break
                case 'WhiteBalloon':
                    this.anim.attachments.push({direction:[0,60,120,180,240,300],radius:28,state:0})
                break
                case 'ZebraBalloon':
                    this.anim.attachments.push({direction:[0,180],radius:32,state:0})
                break
                case 'SlowKingShield':
                    this.anim.attachments.push({main:1})
                break
                default:
                    this.anim.attachments.push(0)
                break
            }
        }
    }
    takeDamage(damage,typeName){
        if(damage>0){
            let effect=damage
            if(typeName=='Physical'&&
                (this.name=='Lead Boss')&&this.life>this.base.life*0.5||
                (this.name=='Lead Balloon')&&this.life>this.base.life*0.25){
                effect*=0.5
            }
            let reEffect=max(damage-this.defense,min(damage,1))
            if(this.shieldLevel>0&&this.activated){
                reEffect=min(reEffect,this.shieldLevel)
            }
            if(this.shield>0){
                this.shield-=reEffect
            }else{
                this.life-=reEffect
            }
        }
    }
    heal(effect){
        this.life=min(this.life+effect,this.base.life)
    }
    summonPosition(number,variance,possibilities){
        for(let a=0,la=number;a<la;a++){
            entities.enemies.push(new enemy(this.layer,this.position.x+random(-variance,variance),this.position.y+random(-variance,variance),findName(possibilities[floor(random(0,possibilities.length))],types.enemy),this.id,{
                path:this.movement.path,
                position:this.movement.position,
                progress:this.movement.progress,
                totalProgress:this.movement.totalProgress-50,
            },false))
        }
    }
    stunRadius(range,value,type){
        let hits=0
        for(let a=0,la=entities.towers.length;a<la;a++){
            if(dist(this.position.x,this.position.y,entities.towers[a].position.x,entities.towers[a].position.y)<range){
                entities.towers[a].applyStun(value,type)
                hits++
            }
        }
        return hits
    }
    stunAngle(range,angle,value,type){
        let hits=0
        for(let a=0,la=entities.towers.length;a<la;a++){
            if(dist(this.position.x,this.position.y,entities.towers[a].position.x,entities.towers[a].position.y)<range){
                let direction=atan2(this.position.x-entities.towers[a].position.x,entities.towers[a].position.y-this.position.y)
                if(abs(direction-(this.direction+this.anim.direction))<angle||
                abs(direction-360-(this.direction+this.anim.direction))<angle||
                abs(direction+360-(this.direction+this.anim.direction))<angle||
                abs(direction-720-(this.direction+this.anim.direction))<angle||
                abs(direction+720-(this.direction+this.anim.direction))<angle){
                    entities.towers[a].applyStun(value,type)
                    hits++
                }
            }
        }
        return hits
    }
    sub(x,y,direction,size,color){
        this.layer.push()
        this.layer.translate(x,y)
        this.layer.rotate(direction)
        this.layer.scale(size)
        this.layer.fill(color[1][0],color[1][1],color[1][2],this.fade)
        this.layer.ellipse(-15,0,12)
        this.layer.ellipse(15,0,12)
        this.layer.fill(color[0][0],color[0][1],color[0][2],this.fade)
        this.layer.ellipse(0,0,24)
        this.layer.stroke(color[2][0],color[2][1],color[2][2],this.fade)
        this.layer.strokeWeight(2)
        this.layer.line(-4,7,4,7)
        this.layer.stroke(color[3][0],color[3][1],color[3][2],this.fade)
        this.layer.strokeWeight(3)
        this.layer.point(-4,2)
        this.layer.point(4,2)
        this.layer.pop()
    }
    display(){
        this.layer.push()
        this.layer.translate(this.position.x+this.offset.position.x,this.position.y+this.offset.position.x)
        this.layer.rotate(this.direction+this.anim.direction)
        this.layer.scale(this.size)
        switch(this.type){
            default:
                for(let a=0,la=this.attachments.length;a<la;a++){
                    this.layer.noStroke()
                    this.layer.noFill()
                    switch(this.attachments[a].name){
                        case 'Body': case 'BodyFlash':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(0,0,24)
                        break
                        case 'Arms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-15,0,12)
                            this.layer.ellipse(15,0,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'Legs':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(5,(lsin(this.rates.main*4))*-7,12)
                            this.layer.ellipse(-5,(lsin(this.rates.main*4))*7,12)
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
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(1)
                            this.layer.ellipse(-16,-1.7,3)
                            this.layer.ellipse(-16,1.7,3)
                            this.layer.ellipse(-15,-5,3)
                            this.layer.ellipse(-15,5,3)
                            this.layer.ellipse(16,-1.7,3)
                            this.layer.ellipse(16,1.7,3)
                            this.layer.ellipse(15,-5,3)
                            this.layer.ellipse(15,5,3)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'Body-Transparent':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.ellipse(0,0,24)
                        break
                        case 'Arms-Transparent':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-15,0,12)
                            this.layer.ellipse(15,0,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'Legs-Transparent':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.ellipse(5,(lsin(this.rates.main*4))*-7,12)
                            this.layer.ellipse(-5,(lsin(this.rates.main*4))*7,12)
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
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-15,0,13,13)
                            this.layer.ellipse(15,0,13,13)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
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
                            this.layer.rotate(lsin(this.rates.main*4)*20+45)
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
                            this.layer.rotate(lsin(this.rates.main*4)*-20-45)
                        break
                        case 'Cloak':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.arc(0,0,26,26,-210,30)
                        break
                        case 'Scythe':
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.line(-15,this.anim.hand,-15,20+this.anim.hand)
                            this.layer.noStroke()
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.triangle(-14,20+this.anim.hand,-14,14+this.anim.hand,-2,15+this.anim.hand)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'OneMovedArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-15,this.anim.hand,12)
                            this.layer.ellipse(15,0,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'FallenBody':
                            for(let b=0,lb=5;b<lb;b++){
                                this.layer.fill(this.attachments[a].color[0]*(0.8+b*0.2),this.attachments[a].color[1]*(0.8+b*0.2),this.attachments[a].color[2]*(0.8+b*0.2),this.fade)
                                this.layer.ellipse(0,0,24*(1-b/lb),24*(1-b/lb))
                            }
                        break
                        case 'FallenArms':
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            for(let b=0,lb=5;b<lb;b++){
                                this.layer.fill(this.attachments[a].color[0]*(0.8+b*0.2),this.attachments[a].color[1]*(0.8+b*0.2),this.attachments[a].color[2]*(0.8+b*0.2),this.fade)
                                this.layer.ellipse(-15,0,12*(1-b/lb),12*(1-b/lb))
                                this.layer.ellipse(15,0,12*(1-b/lb),12*(1-b/lb))
                            }
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'ChainRust':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
        					this.layer.triangle(7,0,0,7,7,12)
                        break
                        case 'Chained':
                            this.layer.rotate(30)
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(1)
                            this.layer.ellipse(6,9,3,3)
                            this.layer.ellipse(5.4,6,3,3)
                            this.layer.ellipse(4.2,3,3,3)
                            this.layer.ellipse(2.4,0.6,3,3)
                            this.layer.ellipse(0.6,-1.8,3,3)
                            this.layer.ellipse(-2.4,-3.9,3,3)
                            this.layer.ellipse(-5.4,-5.4,3,3)
                            this.layer.ellipse(-8.4,-6.6,3,3)
                            this.layer.rotate(-30)
                        break
                        case 'HiddenString':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(3)
                            this.layer.rotate(-18)
                            for(let a=0,la=4;a<la;a++){
                                this.layer.line(lsin(this.time*8+a*25)*2,-14-a*2,lsin(this.time*8+(a-1)*25)*2,-14-a*2+2)
                            }
                            this.layer.rotate(36)
                            for(let a=0,la=4;a<la;a++){
                                this.layer.line(lsin(this.time*8+a*25+70)*-2,-14-a*2,sin(this.time*8+(a-1)*25+70)*-2,-14-a*2+2)
                            }
                            this.layer.rotate(-18)
                        break
                        case 'FallenRusherArms':
                            for(let b=0,lb=5;b<lb;b++){
                                this.layer.fill(this.attachments[a].color[0]*(0.8+b*0.2),this.attachments[a].color[1]*(0.8+b*0.2),this.attachments[a].color[2]*(0.8+b*0.2),this.fade)
                                this.layer.ellipse(map(this.anim.attachments[a].main,0,1,-6,-15*lcos(lsin(this.rates.main*4)*20)),map(this.anim.attachments[a].main,0,1,13,-15*lsin(lsin(this.rates.main*4)*20)),12*(1-b/lb),12*(1-b/lb))
                                this.layer.ellipse(map(this.anim.attachments[a].main,0,1,6,15*lcos(lsin(this.rates.main*4)*20)),map(this.anim.attachments[a].main,0,1,13,15*lsin(lsin(this.rates.main*4)*20)),12*(1-b/lb),12*(1-b/lb))
                            }
                        break
                        case 'FallenRusherShield':
                            this.layer.fill(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade*(1-this.anim.attachments[a].main))
				            this.layer.rect(0,20,24,8,3)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade*(1-this.anim.attachments[a].main))
				            this.layer.rect(0,20,18,2,1.5)
                        break
                        case 'SmallBody':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(0,0,15,15)
                        break
                        case 'SmallMouth':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(1.25)
                            this.layer.line(-2.5,4.375,2.5,4.375)
                        break
                        case 'SmallEyes':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(1.875)
                            this.layer.point(-2.5,1.25)
                            this.layer.point(2.5,1.25)
                        break
                        case 'ArmbandsQuad':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.quad(-13,-5.5,-13,5.5,-15,6,-15,-6)
					        this.layer.quad(13,-5.5,13,5.5,15,6,15,-6)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'LightningImprint':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
        					this.layer.triangle(0,-10,-3,1,1,2)
		        			this.layer.triangle(0,10,3,-1,-1,-2)
                        break
                        case 'Arm1Flash':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-15,0,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'Arm2Flash':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(15,0,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'Leg1Flash':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(-5,(lsin(this.rates.main*4))*7,12)
                        break
                        case 'Leg2Flash':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(5,(lsin(this.rates.main*4))*-7,12)
                        break
                        case 'AngerEyes':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(1.5)
						    this.layer.line(-2.5,1,-5,-0.5)
						    this.layer.line(2.5,1,5,-0.5)
                        break
                        case 'Shocks':
                            for(let b=0,lb=this.anim.attachments[a].shocks.length;b<lb;b++){
                                this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.anim.attachments[a].shocks[b][2])
                                this.layer.rotate(this.anim.attachments[a].shocks[b][0])
                                this.layer.triangle(-3,0,3,0,0,this.anim.attachments[a].shocks[b][1])
                                this.layer.rotate(-this.anim.attachments[a].shocks[b][0])
                            }
                        break
                        case 'LeadBalloon':
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            for(let b=0,lb=3-this.anim.attachments[a].state;b<lb;b++){
                				this.layer.line(0,0,lsin(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,lcos(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius)
                            }
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.noStroke()
                            for(let b=0,lb=3-this.anim.attachments[a].state;b<lb;b++){
                				this.layer.ellipse(lsin(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,lcos(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,20,20)
                            }
                            this.layer.fill(this.attachments[a].color[2][0],this.attachments[a].color[2][1],this.attachments[a].color[2][2],this.fade)
                            for(let b=0,lb=3-this.anim.attachments[a].state;b<lb;b++){
                                this.layer.push()
                				this.layer.translate(lsin(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,lcos(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius)
                                this.layer.rotate(a*60+this.direction)
                                this.layer.ellipse(0,0,7,2)
                                this.layer.ellipse(-6.5,0,2,7)
                                this.layer.ellipse(6.5,0,2,7)
                                this.layer.ellipse(0,6.5,2,7)
                                this.layer.ellipse(0,-6.5,2,7)
                                this.layer.arc(-6.5,-6.5,7,2,-90,150)
                                this.layer.arc(-6.5,6.5,7,2,-150,90)
                                this.layer.arc(6.5,-6.5,7,2,30,270)
                                this.layer.arc(6.5,6.5,7,2,90,330)
                                this.layer.pop()
                            }
                        break
                        case 'TemplarGun':
                            this.layer.fill(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.rect(-2,18,6,18)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.rect(-2,18,10,16)
                            this.layer.fill(this.attachments[a].color[2][0],this.attachments[a].color[2][1],this.attachments[a].color[2][2],this.fade)
                            this.layer.rect(-5,18,4,20,2)
                            this.layer.rect(1,18,4,20,2)
                        break
                        case 'TemplarArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(15,0,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                            this.layer.ellipse(-8,11,12)
                        break
                        case 'TemplarArmbands':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.quad(13,-6,13,6,16,6.5,16,-6.5)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                            this.layer.quad(-2,9,-14,9,-14.5,12,-1.5,12)
                        break
                        case 'TemplarVisor':
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.strokeWeight(1.5)
			                this.layer.rect(0,1,12,4.5,2)
                        break
                        case 'TemplarShield':
                            this.layer.rotate(this.time*1.5)
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade*this.anim.attachments[a].main)
                            this.layer.strokeWeight(6)
                            for(let a=0,la=4;a<la;a++){
                                this.layer.arc(0,0,48,48,-30+a*90,30+a*90)
                            }
                            this.layer.stroke(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade*this.anim.attachments[a].main)
                            this.layer.strokeWeight(1)
                            this.layer.rotate(16)
                            if(this.life>0){
                                for(let a=0,la=4;a<la;a++){
                                    this.layer.rotate(58)
                                    this.layer.line(-2,22,-2,26)
                                    this.layer.ellipse(1,24,2,4)
                                    this.layer.rotate(32)
                                    this.layer.line(-2,22,-2,26)
                                    this.layer.ellipse(1,24,2,4)
                                }
                            }
                            else{
                                for(let a=0,la=4;a<la;a++){
                                    this.layer.rotate(58)
                                    this.layer.line(-2,22,-2,26)
                                    this.layer.line(-2,22,2,22)
                                    this.layer.line(-2,24,2,24)
                                    this.layer.line(-2,26,2,26)
                                    this.layer.rotate(32)
                                    this.layer.line(-2,22,-2,26)
                                    this.layer.line(-2,22,2,22)
                                    this.layer.line(-2,24,2,24)
                                    this.layer.line(-2,26,2,26)
                                }
                            }
                            this.layer.rotate(this.time*-1.5)
                        break
                        case 'SlowKingCape':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.triangle(-7,0,7,0,0,-20)
                            this.layer.triangle(-7,1,7,-1,-6,-19)
                            this.layer.triangle(7,1,-7,-1,6,-19)
                            this.layer.triangle(-7,2,7,-2,-11,-17)
                            this.layer.triangle(7,2,-7,-2,11,-17)
                        break
                        case 'SlowKingArmbands':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.rect(-15,0,3,12)
                            this.layer.rect(15,0,3,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'SlowKingTumor':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(-6,-10,8,8)
                            this.layer.ellipse(-2,-11,6,6)
                            this.layer.ellipse(-9,-7,5,5)
                        break
                        case 'SlowKingShield':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.anim.attachments[a].main*0.4)
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.anim.attachments[a].main)
                            this.layer.strokeWeight(3)
                            this.layer.beginShape()
                            for(let a=0,la=7;a<la;a++){
                                this.layer.vertex(lsin(a*360/7+this.time)*24,lcos(a*360/7+this.time)*24)
                            }
                            this.layer.endShape(CLOSE)
                            this.layer.beginShape()
                            for(let a=0,la=7;a<la;a++){
                                this.layer.vertex(lsin(a*360/7-this.time)*30,lcos(a*360/7-this.time)*30)
                            }
                            this.layer.endShape(CLOSE)
                        break
                        case 'Wings-Transparent':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.strokeWeight(2.5)
                            this.layer.arc(-11,-16,12,34,95,160)
                            this.layer.arc(-9.5,-18,9,30,95,160)
                            this.layer.arc(-8,-20,6,26,95,160)
                            this.layer.arc(11,-16,12,34,20,85)
                            this.layer.arc(9.5,-18,9,30,20,85)
                            this.layer.arc(8,-20,6,26,20,85)
                        break
                        case 'Halo':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(2.5)
                            this.layer.ellipse(0,-12,18,6)
                        break
                        case 'CloakClasp':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.arc(0,0,26,26,-210,30)
                            this.layer.rect(0,1,16,2)
                        break
                        case 'HealthCultistLines':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(1)
                            this.layer.arc(-20,18,40,40,-72,-18)
                            this.layer.arc(-20,18,53,53,-72,-18)
                            this.layer.arc(-20,18,66,66,-66,-24)
                        break
                        case 'HealthCultistLoop-Transparent':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.strokeWeight(3)
                            this.layer.arc(0,0,44,44,this.time,80+this.time)
			                this.layer.arc(0,0,44,44,120+this.time,200+this.time)
			                this.layer.arc(0,0,44,44,240+this.time,320+this.time)
			                this.layer.arc(0,0,34,34,70+this.time,130+this.time)
			                this.layer.arc(0,0,34,34,190+this.time,250+this.time)
			                this.layer.arc(0,0,34,34,310+this.time,370+this.time)
                        break
                        case 'Gun':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rect(-5,22,4,8,2)
                        break
                        case 'FallenGunArms':
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            for(let b=0,lb=5;b<lb;b++){
                                this.layer.fill(this.attachments[a].color[0]*(0.8+b*0.2),this.attachments[a].color[1]*(0.8+b*0.2),this.attachments[a].color[2]*(0.8+b*0.2),this.fade)
                                this.layer.ellipse(15,0,12*(1-b/lb),12*(1-b/lb))
                            }
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                            for(let b=0,lb=5;b<lb;b++){
                                this.layer.fill(this.attachments[a].color[0]*(0.8+b*0.2),this.attachments[a].color[1]*(0.8+b*0.2),this.attachments[a].color[2]*(0.8+b*0.2),this.fade)
                                this.layer.ellipse(-5,14,12*(1-b/lb),12*(1-b/lb))
                            }
                        break
                        case 'GunArmbands':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.rect(15,0,3,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                            this.layer.rect(-5,14,12,3)
                        break
                        case 'Sunglasses':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.arc(0,-3,25,8,15,165)
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.noStroke()
                            this.layer.rect(-4,1,5,5,1)
                            this.layer.rect(4,1,5,5,1)
                        break
                        case 'SoulStealerAxe':
                            this.layer.push()
                            this.layer.translate(-15+this.anim.hand.x,this.anim.hand.y)
                            this.layer.rotate(this.anim.hand.spin)
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(3)
                            this.layer.line(0,0,0,26)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.noStroke()
                            this.layer.quad(1.5,24,1.5,16,12,14,12,26)
                            this.layer.pop()
                        break
                        case 'SoulStealerArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(15,0,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                            this.layer.ellipse(-15+this.anim.hand.x,this.anim.hand.y,12)
                        break
                        case 'Horns':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.beginShape()
                            this.layer.vertex(-5,-11)
                            this.layer.bezierVertex(-8,-12,-11,-15,-11,-18)
                            this.layer.bezierVertex(-11,-15,-10,-11,-8,-9)
                            this.layer.endShape()
                            this.layer.beginShape()
                            this.layer.vertex(5,-11)
                            this.layer.bezierVertex(8,-12,11,-15,11,-18)
                            this.layer.bezierVertex(11,-15,10,-11,8,-9)
                            this.layer.endShape()
                        break
                        case 'SummonerStaff':
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.line(-15,14+this.anim.hand,15,14+this.anim.hand)
                            this.layer.ellipse(20,14+this.anim.hand,10,10)
                            this.layer.point(26,14+this.anim.hand)
                            this.layer.point(20,8+this.anim.hand)
                            this.layer.point(20,20+this.anim.hand)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.noStroke()
                            this.layer.beginShape()
                            this.layer.vertex(24,14+this.anim.hand)
                            this.layer.bezierVertex(21,13+this.anim.hand,21,13+this.anim.hand,20,10+this.anim.hand)
                            this.layer.bezierVertex(19,13+this.anim.hand,19,13+this.anim.hand,16,14+this.anim.hand)
                            this.layer.bezierVertex(19,15+this.anim.hand,19,15+this.anim.hand,20,18+this.anim.hand)
                            this.layer.bezierVertex(21,15+this.anim.hand,21,15+this.anim.hand,24,14+this.anim.hand)
                            this.layer.endShape()
                        break
                        case 'SummonerArms':
                            this.layer.fill(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.ellipse(-8,10+this.anim.hand,12,12)
                			this.layer.ellipse(8,10+this.anim.hand,12,12)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.arc(-8,10+this.anim.hand,13,13,-140,40)
                			this.layer.arc(8,10+this.anim.hand,13,13,-220,-40)
                        break
                        case 'GuardianSpear':
                            this.layer.push()
                            this.layer.translate(-7,14+this.anim.hand.y)
                            this.layer.rotate(this.anim.hand.spin)
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.line(24,4,26,-4)
                            this.layer.line(20,4,22,-4)
                            this.layer.stroke(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.strokeWeight(3)
                            this.layer.line(-6,0,30,0)
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.line(28,4,26,-4)
                            this.layer.line(24,4,22,-4)
                            this.layer.line(20,4,18,-4)
                            this.layer.fill(this.attachments[a].color[2][0],this.attachments[a].color[2][1],this.attachments[a].color[2][2],this.fade)
                            this.layer.noStroke()
                            this.layer.triangle(30,-6,30,6,40,0)
                            this.layer.pop()
                        break
                        case 'GuardianSphere':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(-10,4,5)
                            this.layer.ellipse(10,4,5)
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*0.4)
                            this.layer.ellipse(-10,4,7)
                            this.layer.ellipse(10,4,7)
                            this.layer.ellipse(-10,4,9)
                            this.layer.ellipse(10,4,9)
                        break
                        case 'FallenGuardianArms':
                            for(let b=0,lb=5;b<lb;b++){
                                this.layer.fill(this.attachments[a].color[0]*(0.8+b*0.2),this.attachments[a].color[1]*(0.8+b*0.2),this.attachments[a].color[2]*(0.8+b*0.2),this.fade)
                                this.layer.ellipse(-7,14+this.anim.hand.y,12*(1-b/lb),12*(1-b/lb))
                                this.layer.ellipse(7,14,12*(1-b/lb),12*(1-b/lb))
                            }
                        break
                        case 'DominusCloak':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.arc(0,0,26,26,-210,30)
                            this.layer.triangle(-10,3,-16,-3,-13,-6)
                            this.layer.triangle(10,3,16,-3,13,-6)
                        break
                        case 'FallenBands':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.quad(13,12,1,12,3,10,11,10)
                            this.layer.quad(13,16,1,16,3,18,11,18)
                            this.layer.rect(7,14,12,2)
                            this.layer.rect(7,14,2,4)
                            this.layer.quad(-13,12+this.anim.hand.y,-1,12+this.anim.hand.y,-3,10+this.anim.hand.y,-11,10+this.anim.hand.y)
                            this.layer.quad(-13,16+this.anim.hand.y,-1,16+this.anim.hand.y,-3,18+this.anim.hand.y,-11,18+this.anim.hand.y)
                            this.layer.rect(-7,14+this.anim.hand.y,12,2)
                            this.layer.rect(-7,14+this.anim.hand.y,2,4)
                        break
                        case 'UnknownSubs':
                            this.sub(-10,-9,60,0.35,this.attachments[a].color)
                            this.sub(2,-12,290,0.25,this.attachments[a].color)
                            this.sub(11,-8,150,0.3,this.attachments[a].color)
                            this.sub(-13,3,330,0.35,this.attachments[a].color)
                            this.sub(12,4,200,0.25,this.attachments[a].color)
                            this.sub(-6,11,10,0.3,this.attachments[a].color)
                            this.sub(5,12,250,0.25,this.attachments[a].color)
                        break
                        case 'BodyGlow':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*0.2)
                            for(let b=0,lb=4;b<lb;b++){
                                this.layer.ellipse(0,0,26+b*2)
                            }
                        break
                        case 'FallenSoulArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(15,0,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                            this.layer.ellipse(-12,10+this.anim.hand,12)
                        break
                        case 'FallenSoulArmsGlow':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*0.2)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            for(let b=0,lb=4;b<lb;b++){
                                this.layer.ellipse(15,0,14+b*2)
                            }
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                            for(let b=0,lb=4;b<lb;b++){
                                this.layer.ellipse(-12,10+this.anim.hand,14+b*2)
                            }
                        break
                        case 'FallenSoulWings':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(4)
                            this.layer.arc(-8,-15,6,16,95,160)
			                this.layer.arc(8,-15,6,16,20,85)
                        break
                        case 'FallenSoulKnife':
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(3)
                            this.layer.line(-12,10+this.anim.hand,-12,20+this.anim.hand)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.noStroke()
                            this.layer.triangle(-8,20+this.anim.hand,-16,20+this.anim.hand,-12,32+this.anim.hand)
                        break
                        case 'FallenSoulEyes':
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(5)
                            this.layer.line(-7,4,-3,6)
                            this.layer.line(7,4,3,6)
                            this.layer.stroke(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.line(-7,4,-3,6)
                            this.layer.line(7,4,3,6)
                        break
                        case 'GoldGuardTrident':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(2.5)
                            this.layer.line(map(this.anim.attachments[a].main,0,1,-20,-15),map(this.anim.attachments[a].main,0,1,12,this.anim.hand+20),map(this.anim.attachments[a].main,0,1,16,-15),map(this.anim.attachments[a].main,0,1,12,this.anim.hand-16))
                            this.layer.push()
                            this.layer.translate(map(this.anim.attachments[a].main,0,1,-20,-15),map(this.anim.attachments[a].main,0,1,12,this.anim.hand+20))
                            this.layer.rotate(this.anim.attachments[a].main*-90)
                            this.layer.arc(0,0,12,6,-90,90)
                            this.layer.pop()
                        break
                        case 'GoldGuardArms':
                            for(let b=0,lb=5;b<lb;b++){
                                this.layer.fill(this.attachments[a].color[0]*(0.8+b*0.2),this.attachments[a].color[1]*(0.8+b*0.2),this.attachments[a].color[2]*(0.8+b*0.2),this.fade)
                                this.layer.ellipse(map(this.anim.attachments[a].main,0,1,6,15*lcos(lsin(this.rates.main*4)*20)),map(this.anim.attachments[a].main,0,1,13,15*lsin(lsin(this.rates.main*4)*20)),12*(1-b/lb),12*(1-b/lb))
                                this.layer.ellipse(map(this.anim.attachments[a].main,0,1,-6,-15),map(this.anim.attachments[a].main,0,1,13,this.anim.hand),12*(1-b/lb),12*(1-b/lb))
                            }
                        break
                        case 'MouthGlow':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*0.3)
                            this.layer.strokeWeight(4)
                            this.layer.line(-4,7,4,7)
                            this.layer.strokeWeight(6)
                            this.layer.line(-4,7,4,7)
                        break
                        case 'EyesGlow':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*0.3)
                            this.layer.strokeWeight(5)
                            this.layer.point(-4,2)
                            this.layer.point(4,2)
                            this.layer.strokeWeight(7)
                            this.layer.point(-4,2)
                            this.layer.point(4,2)
                        break
                        case 'LightBodyGlow':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*0.2)
                            for(let b=0,lb=4;b<lb;b++){
                                this.layer.ellipse(0,0,25+b)
                            }
                        break
                        case 'VindicatorCape':
                            this.layer.fill(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.quad(-8,0,8,0,10,-15,-10,-15)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.quad(-6,0,6,0,8,-13,-8,-13)
                        break
                        case 'VindicatorArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(15*lcos(map(this.anim.attachments[a].main,0,1,90,lsin(this.rates.main*4)*20)),15*lsin(map(this.anim.attachments[a].main,0,1,90,lsin(this.rates.main*4)*20)),12)
                            this.layer.ellipse(-14+this.anim.hand.x,5+this.anim.hand.y,12)
                        break
                        case 'VindicatorArmsGlow':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*0.2)
                            for(let b=0,lb=4;b<lb;b++){
                                this.layer.ellipse(15*lcos(map(this.anim.attachments[a].main,0,1,90,lsin(this.rates.main*4)*20)),15*lsin(map(this.anim.attachments[a].main,0,1,90,lsin(this.rates.main*4)*20)),13+b)
                                this.layer.ellipse(-14+this.anim.hand.x,5+this.anim.hand.y,13+b)
                            }
                        break
                        case 'VindicatorEyes':
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(5)
                            this.layer.line(-7,4,-3,6)
                            this.layer.line(7,4,3,6)
                            this.layer.stroke(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.strokeWeight(3)
                            this.layer.line(-7,4,-3,6)
                            this.layer.line(7,4,3,6)
                            this.layer.stroke(this.attachments[a].color[2][0],this.attachments[a].color[2][1],this.attachments[a].color[2][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.line(-7,4,-3,6)
                            this.layer.line(7,4,3,6)
                        break
                        case 'VindicatorSpikes':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.triangle(0,9,0,-6,-16,-7)
                            this.layer.triangle(0,9,0,-6,16,-7)
                            this.layer.triangle(0,10,0,-7,-13,-12)
                            this.layer.triangle(0,10,0,-7,13,-12)
                            this.layer.triangle(-3,11,-1,-10,-7,-16)
                            this.layer.triangle(3,11,1,-10,7,-16)
                        break
                        case 'VindicatorArmbands':
                            this.layer.fill(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.rotate(map(this.anim.attachments[a].main,0,1,90,lsin(this.rates.main*4)*20))
                            this.layer.rect(15,0,3,12)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.quad(13,0,15,-2,17,0,15,2)
                            this.layer.rotate(-map(this.anim.attachments[a].main,0,1,90,lsin(this.rates.main*4)*20))
                            this.layer.fill(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.rect(-14+this.anim.hand.x,5+this.anim.hand.y,12,3)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.quad(-16+this.anim.hand.x,5+this.anim.hand.y,-14+this.anim.hand.x,7+this.anim.hand.y,-12+this.anim.hand.x,5+this.anim.hand.y,-14+this.anim.hand.x,3+this.anim.hand.y)
                        break
                        case 'VindicatorShield':
                            this.layer.fill(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade*(1-this.anim.attachments[a].main))
                            this.layer.triangle(-12,20.5,-12,23.5,-15,22)
                            this.layer.triangle(12,20.5,12,23.5,15,22)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade*(1-this.anim.attachments[a].main))
                            this.layer.rect(0,22,24,5,2)
                            this.layer.fill(this.attachments[a].color[2][0],this.attachments[a].color[2][1],this.attachments[a].color[2][2],this.fade*(1-this.anim.attachments[a].main))
                            this.layer.rect(0,22,20,2,1)
                        break
                        case 'VindicatorHammer':
                            this.layer.push()
                            this.layer.translate(-14+this.anim.hand.x,5+this.anim.hand.y)
                            this.layer.rotate(this.anim.hand.spin)
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.line(0,this.anim.hand.hammer,0,15+this.anim.hand.hammer)
                            this.layer.noStroke()
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.rect(0,18+this.anim.hand.hammer,12,8,2)
                            this.layer.fill(this.attachments[a].color[2][0],this.attachments[a].color[2][1],this.attachments[a].color[2][2],this.fade)
                            this.layer.rect(0,18+this.anim.hand.hammer,10,6,1)
                            this.layer.stroke(this.attachments[a].color[3][0],this.attachments[a].color[3][1],this.attachments[a].color[3][2],this.fade)
                            this.layer.strokeWeight(1)
                            this.layer.line(-4.5,21+this.anim.hand.hammer,4.5,15+this.anim.hand.hammer)
                            this.layer.line(4.5,21+this.anim.hand.hammer,-4.5,15+this.anim.hand.hammer)
                            this.layer.pop()
                        break
                        case 'MoltenArmband':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.line(-15,-6,-15,6)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'MoltenTitanArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(-15*lcos(lsin(this.rates.main*4)*20+this.anim.hand.main),-15*lsin(lsin(this.rates.main*4)*20+this.anim.hand.main),12)
                            this.layer.ellipse(15*lcos(lsin(this.rates.main*4)*20),15*lsin(lsin(this.rates.main*4)*20),12)
                        break
                        case 'MoltenTitanArmbands':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.line(13,-5,13,5)
                            this.layer.line(17,-5,17,5)
                            this.layer.rotate(this.anim.hand.main)
                            this.layer.line(-13,-5,-13,5)
                            this.layer.line(-17,-5,-17,5)
                            this.layer.rotate(lsin(this.rates.main*4)*-20-this.anim.hand.main)
                        break
                        case 'MoltenTitanEyes':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.arc(-4,2,6,6,35,205)
				            this.layer.arc(4,2,6,6,-35,155)
                        break
                        case 'WhiteBalloon':
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            for(let b=0,lb=6-this.anim.attachments[a].state;b<lb;b++){
                				this.layer.line(0,0,lsin(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,lcos(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius)
                            }
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.noStroke()
                            for(let b=0,lb=6-this.anim.attachments[a].state;b<lb;b++){
                				this.layer.ellipse(lsin(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,lcos(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,16,16)
                            }
                            this.layer.fill(this.attachments[a].color[2][0],this.attachments[a].color[2][1],this.attachments[a].color[2][2],this.fade)
                            for(let b=0,lb=6-this.anim.attachments[a].state;b<lb;b++){
                				this.layer.ellipse(lsin(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,lcos(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,10,10)
                            }
                        break
                        case 'ZebraBalloon':
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            for(let b=0,lb=2-this.anim.attachments[a].state;b<lb;b++){
                				this.layer.line(0,0,lsin(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,lcos(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius)
                            }
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.noStroke()
                            for(let b=0,lb=2-this.anim.attachments[a].state;b<lb;b++){
                				this.layer.ellipse(lsin(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,lcos(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,27,27)
                            }
                            this.layer.fill(this.attachments[a].color[2][0],this.attachments[a].color[2][1],this.attachments[a].color[2][2],this.fade)
                            for(let b=0,lb=2-this.anim.attachments[a].state;b<lb;b++){
                                this.layer.push()
                                this.layer.translate(lsin(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius,lcos(this.anim.attachments[a].direction[b]+this.time+this.direction)*this.anim.attachments[a].radius)
                                this.layer.rotate(-this.direction)
                                this.layer.arc(5,0,36,27,-187,-174)
                                this.layer.arc(-4,-4,33,16,-14,0)
                                this.layer.arc(-4,4,33,16,0,14)
                                this.layer.arc(3,-8,27,9,-180,-160)
                                this.layer.arc(3,8,27,9,-200,-180)
                                this.layer.pop()
                            }
                        break
                        case 'VoidReaverArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(15*lcos(lsin(this.rates.main*4)*20+this.anim.hand.main),15*lsin(lsin(this.rates.main*4)*20+this.anim.hand.main),12)
                            this.layer.ellipse(-15*lcos(lsin(this.rates.main*4)*20),-15*lsin(lsin(this.rates.main*4)*20),12)
                        break
                        case 'VoidReaverArmorArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.anim.armor)
                            this.layer.arc(15*lcos(lsin(this.rates.main*4)*20+this.anim.hand.main),15*lsin(lsin(this.rates.main*4)*20+this.anim.hand.main),13,13,lsin(this.rates.main*4)*20+this.anim.hand.main-270,lsin(this.rates.main*4)*20+this.anim.hand.main-90)
                            this.layer.arc(-15*lcos(lsin(this.rates.main*4)*20),-15*lsin(lsin(this.rates.main*4)*20),13,13,lsin(this.rates.main*4)*20-90,lsin(this.rates.main*4)*20+90)
                        break
                        case 'VoidReaverEyes':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(-4,3,2)
                            this.layer.ellipse(4,3,2)
                            this.layer.ellipse(-5,6,2)
                            this.layer.ellipse(5,6,2)
                            this.layer.ellipse(-4,9,2)
                            this.layer.ellipse(4,9,2)
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*0.4)
                            for(let b=0,lb=2;b<lb;b++){
                                this.layer.ellipse(-4,3,3+b)
                                this.layer.ellipse(4,3,3+b)
                                this.layer.ellipse(-5,6,3+b)
                                this.layer.ellipse(5,6,3+b)
                                this.layer.ellipse(-4,9,3+b)
                                this.layer.ellipse(4,9,3+b)
                            }
                        break
                        case 'VoidReaverArmor':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.anim.armor)
                            this.layer.ellipse(0,0,25)
                        break
                        case 'VoidReaverArmorEyes':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.anim.armor)
                            this.layer.ellipse(-4,3,3)
                            this.layer.ellipse(4,3,3)
                            this.layer.ellipse(-5,6,3)
                            this.layer.ellipse(5,6,3)
                            this.layer.ellipse(-4,9,3)
                            this.layer.ellipse(4,9,3)
                        break
                        case 'VoidReaverShield':
                            this.layer.rotate(this.time*1.5)
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade*this.anim.shield)
                            this.layer.strokeWeight(6)
                            for(let a=0,la=4;a<la;a++){
                                this.layer.arc(0,0,48,48,-30+a*90,30+a*90)
                            }
                            this.layer.stroke(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade*this.anim.shield)
                            this.layer.strokeWeight(1)
                            this.layer.rotate(16)
                            if(this.life>0){
                                for(let a=0,la=4;a<la;a++){
                                    this.layer.rotate(58)
                                    this.layer.line(-1.5,22,1.5,22)
                                    this.layer.line(1.5,22,0,26)
                                    this.layer.rotate(32)
                                    this.layer.line(-1.5,22,1.5,22)
                                    this.layer.line(1.5,22,0,26)
                                }
                            }
                            else{
                                for(let a=0,la=4;a<la;a++){
                                    this.layer.rotate(58)
                                    this.layer.line(-2,22,-2,26)
                                    this.layer.line(-2,22,2,22)
                                    this.layer.line(-2,24,2,24)
                                    this.layer.line(-2,26,2,26)
                                    this.layer.rotate(32)
                                    this.layer.line(-2,22,-2,26)
                                    this.layer.line(-2,22,2,22)
                                    this.layer.line(-2,24,2,24)
                                    this.layer.line(-2,26,2,26)
                                }
                            }
                            this.layer.rotate(this.time*-1.5)
                        break
                        case 'MutatedArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-15,0,12)
                            this.layer.ellipse(18,0,16)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'MutatedArmchain':
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(1)
                            this.layer.ellipse(-16,-1.7,3)
                            this.layer.ellipse(-16,1.7,3)
                            this.layer.ellipse(-15,-5,3)
                            this.layer.ellipse(-15,5,3)
                            this.layer.ellipse(20,-2,3.6)
                            this.layer.ellipse(20,2,3.6)
                            this.layer.ellipse(18,-6,3.6)
                            this.layer.ellipse(18,6,3.6)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'BigArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-16,0,13)
                            this.layer.ellipse(16,0,13)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'BigArmchain':
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(1)
                            this.layer.ellipse(-17,-1.8,3.2)
                            this.layer.ellipse(-17,1.8,3.2)
                            this.layer.ellipse(-16,-5,3.2)
                            this.layer.ellipse(-16,5,3.2)
                            this.layer.ellipse(17,-1.8,3.2)
                            this.layer.ellipse(17,1.8,3.2)
                            this.layer.ellipse(16,-5,3.2)
                            this.layer.ellipse(16,5,3.2)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'HazmatMouth':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.arc(0,6,21,5,5,175)
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.noStroke()
                            this.layer.rect(0,8,10,5,2)
                        break
                        case 'HazardousArmbandsQuad':
                            this.layer.fill(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.quad(-12,-5.25,-12,5.25,-15,6,-15,-6)
					        this.layer.quad(12,-5.25,12,5.25,15,6,15,-6)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.quad(-13,-5.5,-13,5.5,-14,5.75,-14,-5.75)
					        this.layer.quad(13,-5.5,13,5.5,14,5.75,14,-5.75)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'ErrorDisc':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(9)
                            this.layer.ellipse(-25*lcos(lsin(this.rates.main*4)*20),-25*lsin(lsin(this.rates.main*4)*20),12)
                        break
                        case 'GravekeeperShovel':
                            this.layer.push()
                            this.layer.translate(-15+this.anim.hand.x,this.anim.hand.y)
                            this.layer.rotate(this.anim.hand.spin)
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.line(0,0,0,16)
                            this.layer.fill(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.noStroke()
                            this.layer.arc(0,16,10,20,0,180)
                            this.layer.fill(this.attachments[a].color[2][0],this.attachments[a].color[2][1],this.attachments[a].color[2][2],this.fade)
                            this.layer.arc(0,16,5,20,0,180)
                            this.layer.pop()
                        break
                        case 'NuclearGuardianSpear':
                            this.layer.push()
                            this.layer.translate(-7,14+this.anim.hand.y)
                            this.layer.rotate(this.anim.hand.spin)
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.line(24,4,26,-4)
                            this.layer.line(20,4,22,-4)
                            this.layer.stroke(this.attachments[a].color[1][0],this.attachments[a].color[1][1],this.attachments[a].color[1][2],this.fade)
                            this.layer.strokeWeight(3)
                            this.layer.line(-6,0,30,0)
                            this.layer.stroke(this.attachments[a].color[0][0],this.attachments[a].color[0][1],this.attachments[a].color[0][2],this.fade)
                            this.layer.strokeWeight(2)
                            this.layer.line(28,4,26,-4)
                            this.layer.line(24,4,22,-4)
                            this.layer.line(20,4,18,-4)
                            this.layer.fill(this.attachments[a].color[2][0],this.attachments[a].color[2][1],this.attachments[a].color[2][2],this.fade)
                            this.layer.noStroke()
                            this.layer.triangle(30,-6,30,6,40,0)
                            this.layer.fill(this.attachments[a].color[3][0],this.attachments[a].color[3][1],this.attachments[a].color[3][2],this.fade)
                            this.layer.triangle(36,-6,36,6,41,0)
                            this.layer.pop()
                        break
                        case 'FarArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-18,0,12)
                            this.layer.ellipse(18,0,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'AmalgamationBones':
                            this.layer.stroke(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.strokeWeight(3)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.line(-18,0,-20,8)
                            this.layer.line(18,0,24,-4)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                            this.layer.line(0,-8,-5,-12)
                            this.layer.line(-3,8,0,14)
                        break
                        case 'AmalgamationBody':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rect(0,0,30,16,6)
                            this.layer.ellipse(0,0,24)
                        break
                        case 'SmallShocks':
                            for(let b=0,lb=this.anim.attachments[a].shocks.length;b<lb;b++){
                                this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.anim.attachments[a].shocks[b][2])
                                this.layer.rotate(this.anim.attachments[a].shocks[b][0])
                                this.layer.triangle(-2,0,2,0,0,this.anim.attachments[a].shocks[b][1]*0.6)
                                this.layer.rotate(-this.anim.attachments[a].shocks[b][0])
                            }
                        break













                    }
                    /*case 'Body':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(0,0,24)
                        break
                        case 'Arms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-15,0,12)
                            this.layer.ellipse(15,0,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'Legs':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(5,(lsin(this.rates.main*4))*-7,12)
                            this.layer.ellipse(-5,(lsin(this.rates.main*4))*7,12)
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
                        case 'MathArms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(-15*lcos(lsin(this.rates.main*4)*20),-15*lsin(lsin(this.rates.main*4)*20),12)
                            this.layer.ellipse(15*lcos(lsin(this.rates.main*4)*20),15*lsin(lsin(this.rates.main*4)*20),12)
                        break*/
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
        this.layer.text(convert(this.life)+"/"+convert(this.base.life),0,0.5)
        if(this.base.shield>0){
            switch(this.name){
                default:
                    this.layer.translate(0,-10)
                    this.layer.fill(150,this.fade*this.anim.life)
                    this.layer.rect(0,0,40,6,3)
                    if(this.collect.shield>=this.shield){
                        this.layer.fill(240,0,0,this.fade*this.anim.shield)
                        this.layer.rect((max(0,this.collect.shield)/this.base.shield)*20-20,0,(max(0,this.collect.shield)/this.base.shield)*40,2+min((max(0,this.collect.shield)/this.base.shield)*80,4),3)
                        this.layer.fill(0,min(355,610-max(0,this.shield)/this.base.shield*510)-max(0,5-max(0,this.shield)/this.base.shield*30)*25,max(0,this.shield)/this.base.shield*510,this.fade*this.anim.life)
                        this.layer.rect((max(0,this.shield)/this.base.shield)*20-20,0,(max(0,this.shield)/this.base.shield)*40,2+min((max(0,this.shield)/this.base.shield)*80,4),3)
                    }else if(this.collect.shield<this.shield){
                        this.layer.fill(240,0,0,this.fade*this.anim.shield)
                        this.layer.rect((max(0,this.shield)/this.base.shield)*20-20,0,(max(0,this.shield)/this.base.shield)*40,2+min((max(0,this.shield)/this.base.shield)*80,4),3)
                        this.layer.fill(0,min(355,610-max(0,this.collect.shield)/this.base.shield*510)-max(0,5-max(0,this.collect.shield)/this.base.shield*30)*25,max(0,this.collect.shield)/this.base.shield*510,this.fade*this.anim.life)
                        this.layer.rect((max(0,this.collect.shield)/this.base.shield)*20-20,0,(max(0,this.collect.shield)/this.base.shield)*40,2+min((max(0,this.collect.shield)/this.base.shield)*80,4),3)
                    }
                    this.layer.fill(0,this.fade*this.anim.life)
                    this.layer.textSize(6)
                    this.layer.text(convert(this.shield)+"/"+convert(this.base.shield),0,0.5)
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
                if(this.movement.position>=this.movement.path.length){
                    game.lives-=ceil(this.life)
                    this.life=0
                }
            }
            for(let a=0,la=this.attachments.length;a<la;a++){
                switch(this.attachments[a].name){
                    case 'FallenRusherArms': case 'FallenRusherShield':
                        this.anim.attachments[a].main=smoothAnim(this.anim.attachments[a].main,this.life/this.base.life<this.attachments[a].metric,0,1,15)
                    break
                    case 'Leg1Flash': case 'Leg2Flash': case 'Arm1Flash': case 'Arm2Flash': case 'BodyFlash':
                        if(floor(random(0,30))==0){
                            this.attachments[a].color=this.anim.attachments[a].possibilities[floor(random(0,this.anim.attachments[a].possibilities.length))]
                        }
                    break
                    case 'Shocks': case 'SmallShocks':
                        for(let b=0,lb=this.anim.attachments[a].shocks.length;b<lb;b++){
                            this.anim.attachments[a].shocks[b][2]-=0.04
                            if(this.anim.attachments[a].shocks[b][2]<=0){
                                this.anim.attachments[a].shocks[b][2]=1
                                this.anim.attachments[a].shocks[b][0]=random(0,360)
                                this.anim.attachments[a].shocks[b][1]=random(15,50)
                            }
                        }
                    break
                    case 'LeadBalloon':
                        if(this.life<=this.base.life*(0.75-this.anim.attachments[a].state*0.25)){
                            entities.particles.push(new particle(this.layer,
                                this.position.x+lsin(this.time+this.anim.attachments[a].direction[2-this.anim.attachments[a].state])*this.anim.attachments[a].radius,
                                this.position.y+lcos(this.time+this.anim.attachments[a].direction[2-this.anim.attachments[a].state])*this.anim.attachments[a].radius,
                                5,[0,0,0],5,0))
                            this.anim.attachments[a].state++
                        }
                        if(this.anim.attachments[a].radius>[24,20,8,0][this.anim.attachments[a].state]){
                            this.anim.attachments[a].radius--
                        }
                        for(let b=0,lb=3-this.anim.attachments[a].state;b<lb;b++){
                            if(this.anim.attachments[a].direction[b]>360*b/lb+5){
                                this.anim.attachments[a].direction[b]-=5
                            }else if(this.anim.attachments[a].direction[b]<360*b/lb-5){
                                this.anim.attachments[a].direction[b]+=5
                            }
                        }
                    break
                    case 'TemplarShield':
                        this.anim.attachments[a].main=smoothAnim(this.anim.attachments[a].main,this.activated,0,1,5)
                    break
                    case 'SlowKingShield':
                        this.anim.attachments[a].main=smoothAnim(this.anim.attachments[a].main,this.shield>0,0,1,5)
                    break
                    case 'GoldGuardArms': case 'GoldGuardTrident':
                        this.anim.attachments[a].main=smoothAnim(this.anim.attachments[a].main,this.life/this.base.life<this.attachments[a].metric,0,1,15)
                    break
                    case 'VindicatorArms': case 'VindicatorArmsGlow': case 'VindicatorArmbands': case 'VindicatorShield':
                        this.anim.attachments[a].main=smoothAnim(this.anim.attachments[a].main,this.life/this.base.life<this.attachments[a].metric,0,1,15)
                    break
                    case 'WhiteBalloon':
                        if(this.life<=this.base.life*(6/7-this.anim.attachments[a].state/7)){
                            entities.particles.push(new particle(this.layer,
                                this.position.x+lsin(this.time+this.anim.attachments[a].direction[2-this.anim.attachments[a].state])*this.anim.attachments[a].radius,
                                this.position.y+lcos(this.time+this.anim.attachments[a].direction[2-this.anim.attachments[a].state])*this.anim.attachments[a].radius,
                                5,[0,0,0],5,0))
                            this.anim.attachments[a].state++
                        }
                        if(this.anim.attachments[a].radius>[28,27,25,22,16,4,0][this.anim.attachments[a].state]){
                            this.anim.attachments[a].radius--
                        }
                        for(let b=0,lb=6-this.anim.attachments[a].state;b<lb;b++){
                            if(this.anim.attachments[a].direction[b]>360*b/lb+5){
                                this.anim.attachments[a].direction[b]-=5
                            }else if(this.anim.attachments[a].direction[b]<360*b/lb-5){
                                this.anim.attachments[a].direction[b]+=5
                            }
                        }
                    break
                    case 'ZebraBalloon':
                        if(this.life<=this.base.life*(2/3-this.anim.attachments[a].state/3)){
                            entities.particles.push(new particle(this.layer,
                                this.position.x+lsin(this.time+this.anim.attachments[a].direction[2-this.anim.attachments[a].state])*this.anim.attachments[a].radius,
                                this.position.y+lcos(this.time+this.anim.attachments[a].direction[2-this.anim.attachments[a].state])*this.anim.attachments[a].radius,
                                5,[0,0,0],5,0))
                            this.anim.attachments[a].state++
                        }
                        if(this.anim.attachments[a].radius>[32,8,0][this.anim.attachments[a].state]){
                            this.anim.attachments[a].radius--
                        }
                        for(let b=0,lb=2-this.anim.attachments[a].state;b<lb;b++){
                            if(this.anim.attachments[a].direction[b]>360*b/lb+5){
                                this.anim.attachments[a].direction[b]-=5
                            }else if(this.anim.attachments[a].direction[b]<360*b/lb-5){
                                this.anim.attachments[a].direction[b]+=5
                            }
                        }
                    break
                }
            }
            switch(this.name){
                case 'Hidden': case 'Shadow Boss':
                    if(this.time%15==0){
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,1,[65,65,65],this.size,random(0,360)))
                    }
                break
                case 'Fallen Rusher':
                    this.speed=this.recall.speed*(this.life<this.base.life*0.875?1/3:1)
                break
                case 'Glitch':
                    if(this.time%15==0){
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,1,this.anim.possibilities[floor(random(0,this.anim.possibilities.length))],this.size,random(0,360)))
                    }
                    if(this.time%60==1&&this.size<1.4){
                        this.size*=1.4
                    }
                    else if(this.time%60==5&&this.size>1){
                        this.size/=1.4
                        for(let a=0,la=8;a<la;a++){
                            entities.particles.push(new particle(this.layer,this.position.x,this.position.y,1,this.anim.possibilities[floor(random(0,this.anim.possibilities.length))],this.size*random(0.8,1.2),random(0,360)))
                        }
                    }
                break
                case 'Circuit':
                    if(this.time%5==0){
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,1,[0,205,255],this.size,random(0,360)))
                    }
                break
                case 'Lead Balloon':
                    this.speed=this.recall.speed*(this.life<this.base.life*0.25?0.5:1)
                break
                case 'Gold Guard':
                    if(this.operation.step==0){
                        this.speed=this.recall.speed*(this.life<this.base.life*0.75?1/5:1)
                    }
                break
                case 'Vindicator':
                    if(this.life<this.base.life/2&&!this.operation.trigger){
                        this.operation.trigger=true
                        this.defense=max(this.defense-40,min(0,this.defense))
                    }
                break
                case 'Molten':
                    if(this.time%10==0){
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,1,[30,30,30],this.size,random(0,360)))
                    }
                break
                case 'Molten Titan':
                    if(this.time%10==0){
                        let spin=random(0,360)
                        let distance=sqrt(random(900))
                        entities.particles.push(new particle(this.layer,this.position.x+lsin(spin)*distance,this.position.y+lcos(spin)*distance,1,[30,30,30],this.size,spin))
                    }
                break
                case 'White Balloon':
                    this.speed=this.recall.speed*(this.life<this.base.life/7?0.4:1)
                break
                case 'Zebra Balloon':
                    this.speed=this.recall.speed*(this.life<this.base.life/3?1/3:1)
                break
                case 'Void Reaver': case 'Nuclear Void Reaver':
                    if(this.time%5==0&&this.anim.armor<=0){
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,8,[0,0,0],this.size,random(0,360)))
                    }
                break
                case 'Void Shadow':
                    if(this.time%15==0){
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,8,[0,0,0],this.size,random(0,360)))
                    }
                break
            }
            if(this.activated){
                switch(this.name){
                    case 'Fallen Reaper':
                        this.operation.timer++
                        if(this.operation.timer%510<60){
                            this.anim.hand+=this.operation.timer%510<=30?0.35:-0.35
                            this.speed=0
                            if(this.operation.timer%510==30){
                                this.summonPosition(floor(random(2,4)),25,this.spawns)
                            }
                        }
                        else{
                            this.speed=this.recall.speed
                            this.anim.hand=0
                        }
                    break
                    case 'Mega Speedy':
                        if(this.time%150==75){
                            this.speed=this.recall.speed*3
                            let direction=random(0,360/7)
                            for(let a=0,la=7;a<la;a++){
                                entities.particles.push(new particle(this.layer,this.position.x,this.position.y,1,[85,85,85],this.size,direction+a*360/7))
                            }
                        }
                        else if(this.speed>this.recall.speed){
                            this.speed-=1/10
                        }
                    break
                    case 'Circuit':
                        if(this.time%180==150){
                            entities.particles.push(new particle(this.layer,this.position.x,this.position.y,3,[105,255,255],100,0))
                            for(let a=0,la=entities.enemies.length;a<la;a++){
                                if(entities.enemies[a].life<=10000){
                                    entities.enemies[a].speed*=1.2
                                    entities.enemies[a].recall.speed*=1.2
                                    entities.enemies[a].counters.zaps++
                                    for(let b=0,lb=entities.enemies[a].counters.zaps;b<lb;b++){
                                        entities.particles.push(new particle(this.layer,entities.enemies[a].position.x+b*12-entities.enemies[a].counters.zaps*6+6,entities.enemies[a].position.y,4,[105,255,255],1,0))
                                    }
                                }
                            }
                        }
                    break
                    case 'Health Cultist':
                        if(this.time%60==0){
                            for(let a=0,la=entities.enemies.length;a<la;a++){
                                if(dist(this.position.x,this.position.y,entities.enemies[a].position.x,entities.enemies[a].position.y)<125&&entities.enemies[a].life<=10000){
                                    entities.enemies[a].heal(500)
                                    entities.particles.push(new particle(this.layer,this.position.x,this.position.y,6,[80,255,80],1,0))
                                }
                            }
                        }
                    break
                    case 'SCT':
                        switch(this.operation.step){
                            case 0:
                                for(let a=0,la=entities.towers.length;a<la;a++){
                                    if(dist(entities.towers[a].position.x,entities.towers[a].position.y,this.position.x,this.position.y)<200){
                                        this.operation.step=1
                                        this.operation.timer=0
                                        this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                        la=0
                                    }
                                }
                            break
                            case 1:
                                let goal=atan2(this.position.x-this.operation.target.x,this.operation.target.y-this.position.y)
                                let value=directionValue(this.direction+this.anim.direction,goal,3)
                                switch(value){
                                    case 0:
                                        this.anim.direction=goal-this.direction
                                        this.operation.step=2
                                    break
                                    case 1:
                                        this.anim.direction+=3
                                    break
                                    case 2:
                                        this.anim.direction-=3
                                    break
                                }
                            break
                            case 2:
                                this.operation.timer++
                                if(this.operation.timer==5||this.operation.timer==15||this.operation.timer==25){
                                    entities.projectiles.push(new projectile(this.layer,
                                        this.position.x+lcos(this.direction+this.anim.direction)*-5-lsin(this.direction+this.anim.direction)*20,
                                        this.position.y+lsin(this.direction+this.anim.direction)*-5+lcos(this.direction+this.anim.direction)*20,
                                        1,0,this.direction+this.anim.direction+180,150,0))
                                }
                                if(this.operation.timer==30){
                                    this.operation.step=3
                                    this.operation.timer=0
                                }
                            break
                            case 3:
                                if(abs(this.anim.direction)<3){
                                    this.anim.direction=0
                                    this.operation.step=4
                                }else if(this.anim.direction>0){
                                    this.anim.direction-=3
                                }else if(this.anim.direction<0){
                                    this.anim.direction+=3
                                }
                                this.operation.timer++
                            break
                            case 4:
                                this.operation.timer++
                                if(this.operation.timer==900){
                                    this.operation.step=0
                                }
                            break
                        }
                    break
                    case 'Soul Stealer':
                        switch(this.operation.step){
                            case 0:
                                for(let a=0,la=entities.towers.length;a<la;a++){
                                    if(dist(entities.towers[a].position.x,entities.towers[a].position.y,this.position.x,this.position.y)<80){
                                        this.operation.step=1
                                        this.operation.timer=0
                                        this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                        this.speed=0
                                        la=0
                                    }
                                }
                            break
                            case 1:
                                let goal=atan2(this.position.x-this.operation.target.x,this.operation.target.y-this.position.y)
                                let value=directionValue(this.direction+this.anim.direction,goal,3)
                                switch(value){
                                    case 0:
                                        this.anim.direction=goal-this.direction
                                        this.operation.step=2
                                    break
                                    case 1:
                                        this.anim.direction+=3
                                    break
                                    case 2:
                                        this.anim.direction-=3
                                    break
                                }
                            break
                            case 2:
                                this.operation.timer++
                                if(this.operation.timer<=30){
                                    this.anim.hand.x+=0.5
                                    this.anim.hand.y+=0.5
                                    this.anim.hand.spin+=2
                                }else if(this.operation.timer<=60){
                                    this.anim.hand.spin-=4
                                    if(this.operation.timer==45){
                                        this.summonPosition(this.stunAngle(80,30,150,0),25,['Soul'])
                                    }
                                }else if(this.operation.timer<=90){
                                    this.anim.hand.x-=0.5
                                    this.anim.hand.y-=0.5
                                    this.anim.hand.spin+=2
                                }else{
                                    this.operation.step=3
                                    this.operation.timer=0
                                }
                            break
                            case 3:
                                if(abs(this.anim.direction)<3){
                                    this.anim.direction=0
                                    this.operation.step=4
                                    this.speed=this.recall.speed
                                }else if(this.anim.direction>0){
                                    this.anim.direction-=3
                                }else if(this.anim.direction<0){
                                    this.anim.direction+=3
                                }
                                this.operation.timer++
                            break
                            case 4:
                                this.operation.timer++
                                if(this.operation.timer==600){
                                    this.operation.step=0
                                }
                            break
                        }
                    break
                    case 'Summoner Boss':
                        if(this.time%600==1){
                            this.speed=0
                        }
                        if(this.time%600<=30){
                            this.anim.hand+=0.2
                            if(this.time%300==30){
                                entities.particles.push(new particle(this.layer,this.position.x,this.position.y,2,[60,20,120],25,0))
                                this.summonPosition(1,25,['Mystery Boss'])
                                this.summonPosition(3,25,['Mystery'])
                            }
                        }else if(this.time%600<=60){
                            this.anim.hand-=0.2
                            if(this.time%600==60){
                                this.speed=this.recall.speed
                            }
                        }
                    break
                    case 'Fallen Guardian':
                        switch(this.operation.step){
                            case 0:
                                for(let a=0,la=entities.towers.length;a<la;a++){
                                    if(dist(entities.towers[a].position.x,entities.towers[a].position.y,this.position.x,this.position.y)<100){
                                        this.operation.step=1
                                        this.operation.timer=0
                                        this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                        this.speed=0
                                        la=0
                                    }
                                }
                            break
                            case 1:
                                let goal=atan2(this.position.x-this.operation.target.x,this.operation.target.y-this.position.y)
                                let value=directionValue(this.direction+this.anim.direction,goal,3)
                                switch(value){
                                    case 0:
                                        this.anim.direction=goal-this.direction
                                        this.operation.step=2
                                    break
                                    case 1:
                                        this.anim.direction+=3
                                    break
                                    case 2:
                                        this.anim.direction-=3
                                    break
                                }
                            break
                            case 2:
                                this.operation.timer++
                                if(this.operation.timer<=30){
                                    this.anim.hand.spin+=3
                                }else if(this.operation.timer<=45){
                                    this.anim.hand.y+=0.5
                                    if(this.operation.timer==45){
                                        switch(this.name){
                                            case 'Fallen Guardian':
                                                this.stunAngle(100,15,180,0)
                                            break
                                            case 'Nuclear Guardian':
                                                this.stunAngle(100,15,240,0)
                                            break
                                        }
                                    }
                                }else if(this.operation.timer<=60){
                                    this.anim.hand.y-=0.5
                                }else if(this.operation.timer<=90){
                                    this.anim.hand.spin-=3
                                }else{
                                    this.operation.step=3
                                    this.operation.timer=0
                                }
                            break
                            case 3:
                                if(abs(this.anim.direction)<3){
                                    this.anim.direction=0
                                    this.operation.step=4
                                    this.speed=this.recall.speed
                                }else if(this.anim.direction>0){
                                    this.anim.direction-=3
                                }else if(this.anim.direction<0){
                                    this.anim.direction+=3
                                }
                                this.operation.timer++
                            break
                            case 4:
                                this.operation.timer++
                                if(this.operation.timer==450){
                                    this.operation.step=0
                                }
                            break
                        }
                    break
                    case 'Unknown':
                        switch(this.operation.step){
                            case 0:
                                for(let a=0,la=entities.towers.length;a<la;a++){
                                    if(dist(entities.towers[a].position.x,entities.towers[a].position.y,this.position.x,this.position.y)<75){
                                        this.operation.step=1
                                        this.operation.timer=0
                                        this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                        this.speed=0
                                        la=0
                                    }
                                }
                            break
                            case 1:
                                this.operation.timer++
                                this.size=this.base.size*(1+0.5*lsin(this.operation.timer*3/2))
                                if(this.operation.timer>=120){
                                    this.stunRadius(90,180,0)
                                    entities.particles.push(new particle(this.layer,this.position.x,this.position.y,2,[0,0,0],30,0))
                                    this.operation.step=2
                                    this.operation.timer=0
                                    this.speed=this.recall.speed
                                }
                            break
                            case 2:
                                this.operation.timer++
                                if(this.operation.timer==750){
                                    this.operation.step=0
                                }
                            break
                        }
                    break
                    case 'Fallen Soul':
                        switch(this.operation.step){
                            case 0:
                                for(let a=0,la=entities.towers.length;a<la;a++){
                                    if(dist(entities.towers[a].position.x,entities.towers[a].position.y,this.position.x,this.position.y)<40){
                                        this.operation.step=1
                                        this.operation.timer=0
                                        this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                        this.speed=0
                                        la=0
                                    }
                                }
                            break
                            case 1:
                                let goal=atan2(this.position.x-this.operation.target.x,this.operation.target.y-this.position.y)
                                let value=directionValue(this.direction+this.anim.direction,goal,3)
                                switch(value){
                                    case 0:
                                        this.anim.direction=goal-this.direction
                                        this.operation.step=2
                                    break
                                    case 1:
                                        this.anim.direction+=3
                                    break
                                    case 2:
                                        this.anim.direction-=3
                                    break
                                }
                            break
                            case 2:
                                this.operation.timer++
                                if(this.operation.timer<=15){
                                    this.anim.hand+=0.5
                                    if(this.operation.timer==15){
                                        this.stunAngle(40,10,60,0)
                                    }
                                }else if(this.operation.timer<=30){
                                    this.anim.hand-=0.5
                                }else{
                                    this.operation.step=3
                                    this.operation.timer=0
                                }
                            break
                            case 3:
                                if(abs(this.anim.direction)<3){
                                    this.anim.direction=0
                                    this.operation.step=4
                                    this.speed=this.recall.speed
                                }else if(this.anim.direction>0){
                                    this.anim.direction-=3
                                }else if(this.anim.direction<0){
                                    this.anim.direction+=3
                                }
                                this.operation.timer++
                            break
                            case 4:
                                this.operation.timer++
                                if(this.operation.timer==450){
                                    this.operation.step=0
                                }
                            break
                        }
                    break
                    case 'Gold Guard':
                        if(this.life<this.base.life*3/4-1){
                            this.life=min(this.life+15,this.base.life*3/4-1)
                        }
                        if(this.life<this.base.life*3/4){
                            switch(this.operation.step){
                                case 0:
                                    for(let a=0,la=entities.towers.length;a<la;a++){
                                        if(dist(entities.towers[a].position.x,entities.towers[a].position.y,this.position.x,this.position.y)<60){
                                            this.operation.step=1
                                            this.operation.timer=0
                                            this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                            this.speed=0
                                            la=0
                                        }
                                    }
                                break
                                case 1:
                                    let goal=atan2(this.position.x-this.operation.target.x,this.operation.target.y-this.position.y)
                                    let value=directionValue(this.direction+this.anim.direction,goal,3)
                                    switch(value){
                                        case 0:
                                            this.anim.direction=goal-this.direction
                                            this.operation.step=2
                                        break
                                        case 1:
                                            this.anim.direction+=3
                                        break
                                        case 2:
                                            this.anim.direction-=3
                                        break
                                    }
                                break
                                case 2:
                                    this.operation.timer++
                                    if(this.operation.timer<=15){
                                        this.anim.hand++
                                        if(this.operation.timer==15){
                                            this.stunAngle(60,15,150,0)
                                        }
                                    }else if(this.operation.timer<=30){
                                        this.anim.hand--
                                    }else{
                                        this.operation.step=3
                                        this.operation.timer=0
                                    }
                                break
                                case 3:
                                    if(abs(this.anim.direction)<3){
                                        this.anim.direction=0
                                        this.operation.step=4
                                        this.speed=this.recall.speed*(this.life<this.base.life*0.75?1/5:1)
                                    }else if(this.anim.direction>0){
                                        this.anim.direction-=3
                                    }else if(this.anim.direction<0){
                                        this.anim.direction+=3
                                    }
                                    this.operation.timer++
                                break
                                case 4:
                                    this.operation.timer++
                                    if(this.operation.timer==450){
                                        this.operation.step=0
                                    }
                                break
                            }
                        }
                    break
                    case 'Vindicator':
                        switch(this.operation.step){
                            case 0:
                                for(let a=0,la=entities.towers.length;a<la;a++){
                                    if(dist(entities.towers[a].position.x,entities.towers[a].position.y,this.position.x,this.position.y)<180){
                                        this.operation.step=1
                                        this.operation.timer=0
                                        this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                        this.speed=0
                                        la=0
                                    }
                                }
                            break
                            case 1:
                                let goal=atan2(this.position.x-this.operation.target.x,this.operation.target.y-this.position.y)
                                let value=directionValue(this.direction+this.anim.direction,goal,3)
                                switch(value){
                                    case 0:
                                        this.anim.direction=goal-this.direction
                                        this.operation.step=2
                                    break
                                    case 1:
                                        this.anim.direction+=3
                                    break
                                    case 2:
                                        this.anim.direction-=3
                                    break
                                }
                            break
                            case 2:
                                this.operation.timer++
                                if(this.operation.timer<=30){
                                    this.anim.hand.y+=0.5
                                    this.anim.hand.x+=0.3
                                    this.anim.hand.spin+=0.5
                                }else if(this.operation.timer<=90){
                                    this.anim.hand.hammer+=lcos((this.operation.timer-30.5)*3)*4
                                    this.anim.hand.spin-=0.5
                                    if(this.operation.timer==60){
                                        this.stunAngle(180,10,180,0)
                                    }
                                }else if(this.operation.timer<=120){
                                    this.anim.hand.y-=0.5
                                    this.anim.hand.x-=0.3
                                    this.anim.hand.spin+=0.5
                                }else{
                                    this.operation.step=3
                                    this.anim.hand.hammer=0
                                    this.operation.timer=0
                                }
                            break
                            case 3:
                                if(abs(this.anim.direction)<3){
                                    this.anim.direction=0
                                    this.operation.step=4
                                    this.speed=this.recall.speed
                                }else if(this.anim.direction>0){
                                    this.anim.direction-=3
                                }else if(this.anim.direction<0){
                                    this.anim.direction+=3
                                }
                                this.operation.timer++
                            break
                            case 4:
                                this.operation.timer++
                                if(this.operation.timer==300){
                                    this.operation.step=0
                                }
                            break
                        }
                    break
                    case 'Molten':
                        this.life=min(this.life+0.1,this.base.life)
                    break
                    case 'Speedy King':
                        if(this.time%900==450){
                            entities.particles.push(new particle(this.layer,this.position.x,this.position.y,3,[0,200,255],20,0))
                            this.speed*=1.1
                            this.recall.speed*=1.1
                            this.counters.zaps++
                            for(let b=0,lb=this.counters.zaps;b<lb;b++){
                                entities.particles.push(new particle(this.layer,this.position.x+b*12-this.counters.zaps*6+6,this.position.y,4,[105,255,255],1,0))
                            }
                        }
                    break
                    case 'Gravekeeper':
                        switch(this.operation.step){
                            case 0:
                                if(floor(random(0,300))==0){
                                    this.operation.step=1
                                    this.operation.timer=0
                                    this.speed=0
                                    la=0
                                }
                            break
                            case 1:
                                this.operation.timer++
                                if(this.operation.timer<=30){
                                    this.anim.hand.x+=0.5
                                    this.anim.hand.y+=0.5
                                    this.anim.hand.spin+=1.5
                                }else if(this.operation.timer<=60||this.operation.timer>90&&this.operation.timer<=120){
                                    this.anim.hand.spin-=3
                                    if(this.operation.timer==60||this.operation.timer==120){
                                        this.summonPosition(2,25,this.spawns)
                                    }
                                }else if(this.operation.timer<=90){
                                    this.anim.hand.spin+=3
                                    if(this.operation.timer==90){
                                        this.summonPosition(2,25,this.spawns)
                                    }
                                }else if(this.operation.timer<=150){
                                    this.anim.hand.x-=0.5
                                    this.anim.hand.y-=0.5
                                    this.anim.hand.spin+=1.5
                                }else{
                                    this.operation.step=2
                                    this.operation.timer=0
                                    this.speed=this.recall.speed
                                }
                            break
                            case 2:
                                this.operation.timer++
                                if(this.operation.timer==450){
                                    this.operation.step=0
                                }
                            break
                        }
                    break
                    

                }
            }
            switch(this.name){
                case 'Molten Titan':
                    if(this.operation.step==0){
                        let option=floor(random(0,3))
                        switch(option){
                            case 0:
                                for(let a=0,la=entities.towers.length;a<la;a++){
                                    if(dist(entities.towers[a].position.x,entities.towers[a].position.y,this.position.x,this.position.y)<100){
                                        this.operation.step=1
                                        this.operation.timer=0
                                        this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                        this.operation.attack=0
                                        this.speed=0
                                        la=0
                                    }
                                }
                            break
                            case 1:
                                if(floor(random(0,300))==0){
                                    this.operation.step=1
                                    this.operation.timer=0
                                    this.operation.attack=1
                                    this.speed=0
                                }
                            break
                            case 2:
                                for(let a=0,la=entities.towers.length;a<la;a++){
                                    let direction=atan2(entities.towers[a].position.x-this.position.x,entities.towers[a].position.y-this.position.y)
                                    if((abs(this.direction-direction)<45||abs(this.direction-direction-360)<45||abs(this.direction-direction+360)<45||abs(this.direction-direction-720)<45||abs(this.direction-direction+720)<45)&&floor(random(0,300))==0&&!entities.towers[a].stunned){
                                        this.operation.step=1
                                        this.operation.timer=0
                                        this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                        this.operation.attack=2
                                        this.speed=0
                                        this.operation.stagger=0
                                        la=0
                                    }
                                }
                            break
                        }
                    }else{
                        switch(this.operation.attack){
                            case 0:
                                switch(this.operation.step){
                                    case 1:
                                        this.operation.timer++
                                        this.size=this.base.size*(1+0.5*lsin(this.operation.timer*3/2))
                                        if(this.operation.timer>=120){
                                            this.stunRadius(120,240,0)
                                            entities.particles.push(new particle(this.layer,this.position.x,this.position.y,2,[0,0,0],30,0))
                                            this.operation.step=2
                                            this.operation.timer=0
                                            this.speed=this.recall.speed
                                        }
                                    break
                                    case 2:
                                        this.operation.timer++
                                        if(this.operation.timer==300){
                                            this.operation.step=0
                                        }
                                    break
                                }
                            break
                            case 1:
                                switch(this.operation.step){
                                    case 1:
                                        this.operation.timer++
                                        this.operation.diff=-90-lsin(this.rates.main*4)*20
                                        if(this.operation.timer<=30){
                                            this.anim.hand.main+=this.operation.diff/30
                                        }else if(this.operation.timer==60){
                                            this.summonPosition(5,25,['Molten'])
                                        }else if(this.operation.timer>90){
                                            this.anim.hand.main-=this.operation.diff/30
                                        }
                                        if(this.operation.timer>=120){
                                            this.operation.step=2
                                            this.operation.timer=0
                                            this.speed=this.recall.speed
                                        }
                                    break
                                    case 2:
                                        this.operation.timer++
                                        if(this.operation.timer==450){
                                            this.operation.step=0
                                        }
                                    break
                                }
                            break
                            case 2:
                                switch(this.operation.step){
                                    case 1:
                                        this.operation.timer++
                                        this.operation.diff=-135-lsin(this.rates.main*4)*20
                                        if(this.operation.timer<=60){
                                            this.anim.hand.main+=this.operation.diff/60
                                        }else{
                                            this.anim.hand.main-=this.operation.diff/60
                                        }
                                        if(this.operation.timer>=60&&this.operation.timer%15==0){
                                            entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,2,0,this.direction+140+20*this.operation.stagger,120,0))
                                            this.operation.stagger++
                                        }
                                        if(this.operation.timer>=120){
                                            this.operation.step=2
                                            this.operation.timer=0
                                            this.speed=this.recall.speed
                                        }
                                    break
                                    case 2:
                                        this.operation.timer++
                                        if(this.operation.timer==300){
                                            this.operation.step=0
                                        }
                                    break
                                }
                            break
                        }
                    }
                break
                case 'Void Reaver': case 'Nuclear Void Reaver':
                    if(this.operation.spawn>0){
                        this.operation.spawn--
                        if(this.operation.spawn%120==0){
                            entities.spawner.pathSpawn(findName('Fallen Guardian',types.enemy),this.movement.id)
                        }
                    }
                    if(this.operation.shield>0){
                        this.operation.shield--
                        this.shieldLevel=7
                    }else{
                        this.shieldLevel=0
                    }
                    this.anim.shield=smoothAnim(this.anim.shield,this.operation.shield>0,0,1,5)
                    if(this.operation.step==0){
                        if(this.life<=this.base.life/10){
                            this.speed=this.recall.speed*3
                            for(let a=0,la=this.attachments.length;a<la;a++){
                                if(this.name=='Void Reaver'&&this.attachments[a].name=='VoidReaverEyes'&&this.attachments[a].color[2]>0){
                                    this.attachments[a].color[0]+=5/6
                                    this.attachments[a].color[2]-=5/6
                                }else if(this.name=='Nuclear Void Reaver'&&this.attachments[a].name=='VoidReaverEyes'&&this.attachments[a].color[1]<255){
                                    this.attachments[a].color[1]+=5
                                }
                            }
                        }else if(this.life<=this.base.life*0.4&&this.anim.armor>0){
                            this.operation.step=1
                            this.operation.timer=0
                            this.operation.attack=5
                            this.speed=0
                        }else{
                            let option=this.anim.armor<=0?floor(random(2,4.5)):floor(random(0,1.5))
                            switch(option){
                                case 0:
                                    for(let a=0,la=entities.towers.length;a<la;a++){
                                        if(dist(entities.towers[a].position.x,entities.towers[a].position.y,this.position.x,this.position.y)<125){
                                            this.operation.step=1
                                            this.operation.timer=0
                                            this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                            this.operation.attack=0
                                            this.speed=0
                                            la=0
                                        }
                                    }
                                break
                                case 1: case 4:
                                    if(floor(random(0,300))==0){
                                        this.operation.step=1
                                        this.operation.timer=0
                                        this.operation.attack=option
                                        this.speed=0
                                    }
                                break
                                case 2:
                                    for(let a=0,la=entities.towers.length;a<la;a++){
                                        let direction=atan2(entities.towers[a].position.x-this.position.x,entities.towers[a].position.y-this.position.y)
                                        if((abs(this.direction-direction)<45||abs(this.direction-direction-360)<45||abs(this.direction-direction+360)<45||abs(this.direction-direction-720)<45||abs(this.direction-direction+720)<45)&&floor(random(0,300))==0&&!entities.towers[a].stunned){
                                            this.operation.step=1
                                            this.operation.timer=0
                                            this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                            this.operation.attack=2
                                            this.speed=0
                                            this.operation.stagger=0
                                            la=0
                                        }
                                    }
                                break
                                case 3:
                                    for(let a=0,la=entities.towers.length;a<la;a++){
                                        let direction=atan2(entities.towers[a].position.x-this.position.x,entities.towers[a].position.y-this.position.y)
                                        if((abs(this.direction-direction)<25||abs(this.direction-direction-360)<25||abs(this.direction-direction+360)<25||abs(this.direction-direction-720)<25||abs(this.direction-direction+720)<25)&&floor(random(0,300))==0&&!entities.towers[a].stunned){
                                            this.operation.step=1
                                            this.operation.timer=0
                                            this.operation.target={x:entities.towers[a].position.x,y:entities.towers[a].position.y}
                                            this.operation.attack=3
                                            this.speed=0
                                            la=0
                                        }
                                    }
                                break
                            }
                        }
                    }else{
                        switch(this.operation.attack){
                            case 0:
                                switch(this.operation.step){
                                    case 1:
                                        this.operation.timer++
                                        this.size=this.base.size*(1+0.5*lsin(this.operation.timer*3/2))
                                        if(this.operation.timer>=120){
                                            this.stunRadius(150,this.name=='Nuclear Void Reaver'?360:300,0)
                                            entities.particles.push(new particle(this.layer,this.position.x,this.position.y,2,[0,0,0],30,0))
                                            this.operation.step=2
                                            this.operation.timer=0
                                            this.speed=this.recall.speed
                                        }
                                    break
                                    case 2:
                                        this.operation.timer++
                                        if(this.operation.timer==300){
                                            this.operation.step=0
                                        }
                                    break
                                }
                            break
                            case 1:
                                switch(this.operation.step){
                                    case 1:
                                        this.operation.timer++
                                        this.operation.diff=90-lsin(this.rates.main*4)*20
                                        if(this.operation.timer<=30){
                                            this.anim.hand.main+=this.operation.diff/30
                                        }else if(this.operation.timer==60){
                                            this.summonPosition(this.name=='Nuclear Void Reaver'?8:6,25,this.spawns)
                                        }else if(this.operation.timer>90){
                                            this.anim.hand.main-=this.operation.diff/30
                                        }
                                        if(this.operation.timer>=120){
                                            this.operation.step=2
                                            this.operation.timer=0
                                            this.speed=this.recall.speed
                                        }
                                    break
                                    case 2:
                                        this.operation.timer++
                                        if(this.operation.timer==450){
                                            this.operation.step=0
                                        }
                                    break
                                }
                            break
                            case 2:
                                switch(this.operation.step){
                                    case 1:
                                        this.operation.timer++
                                        this.operation.diff=135-lsin(this.rates.main*4)*20
                                        if(this.operation.timer<=60){
                                            this.anim.hand.main+=this.operation.diff/60
                                        }else{
                                            this.anim.hand.main-=this.operation.diff/60
                                        }
                                        if(this.operation.timer>=60&&this.operation.timer%(this.name=='Nuclear Void Reaver'?8:10)==0){
                                            entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,3,0,this.direction+225-15*this.operation.stagger,180,0))
                                            this.operation.stagger++
                                        }
                                        if(this.operation.timer>=120){
                                            this.operation.step=2
                                            this.operation.timer=0
                                            this.speed=this.recall.speed
                                        }
                                    break
                                    case 2:
                                        this.operation.timer++
                                        if(this.operation.timer==300){
                                            this.operation.step=0
                                        }
                                    break
                                }
                            break
                            case 3:
                                switch(this.operation.step){
                                    case 1:
                                        this.operation.timer++
                                        this.operation.diff=90-lsin(this.rates.main*4)*20
                                        if(this.operation.timer<=30){
                                            this.anim.hand.main+=this.operation.diff/30
                                        }else if(this.operation.timer==30||this.operation.timer==36||this.operation.timer==42||this.operation.timer==48||this.operation.timer==54){
                                            entities.particles.push(new particle(this.layer,this.position.x,this.position.y,7,[0,0,0],100,this.direction))
                                        }else if(this.operation.timer==60){
                                            this.summonPosition(this.stunAngle(1000,30,this.name=='Nuclear Void Reaver'?180:150,0),25,['Soul'])
                                        }else if(this.operation.timer>90){
                                            this.anim.hand.main-=this.operation.diff/30
                                        }
                                        if(this.operation.timer>=120){
                                            this.operation.step=2
                                            this.operation.timer=0
                                            this.speed=this.recall.speed
                                        }
                                    break
                                    case 2:
                                        this.operation.timer++
                                        if(this.operation.timer==450){
                                            this.operation.step=0
                                        }
                                    break
                                }
                            break
                            case 4:
                                switch(this.operation.step){
                                    case 1:
                                        this.operation.timer++
                                        this.anim.hand.main+=2
                                        if(this.operation.timer%(this.name=='Nuclear Void Reaver'?20:30)==0){
                                            entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,3,0,this.direction+this.anim.hand.main,180,0))
                                        }
                                        if(this.operation.timer>=180){
                                            this.operation.step=2
                                            this.operation.timer=0
                                            this.speed=this.recall.speed
                                        }
                                    break
                                    case 2:
                                        this.operation.timer++
                                        if(this.operation.timer==450){
                                            this.operation.step=0
                                        }
                                    break
                                }
                            break
                            case 5:
                                switch(this.operation.step){
                                    case 1:
                                        this.operation.timer++
                                        this.size=this.base.size*(1+0.5*lsin(this.operation.timer*3/4))
                                        if(this.operation.timer>=240){
                                            this.stunRadius(250,this.name=='Nuclear Void Reaver'?576:480,0)
                                            for(let a=0,la=this.name=='Nuclear Void Reaver'?30:24;a<la;a++){
                                                entities.projectiles.push(new projectile(this.layer,this.position.x,this.position.y,3,0,this.direction+360*a/la,180,0))
                                            }
                                            entities.particles.push(new particle(this.layer,this.position.x,this.position.y,2,[0,0,0],50,0))
                                            this.operation.step=2
                                            this.operation.timer=0
                                            this.speed=this.recall.speed
                                            this.operation.shield=960
                                            this.operation.spawn=540
                                        }
                                    break
                                    case 2:
                                        this.anim.armor-=1/60
                                        this.operation.timer++
                                        if(this.operation.timer==60){
                                            this.operation.step=3
                                            this.operation.timer=0
                                        }
                                    break
                                    case 3:
                                        this.operation.timer++
                                        if(this.operation.timer==300){
                                            this.operation.step=0
                                        }
                                    break
                                }
                            break
                        }
                    }
                break

            }
        }else{
            if(!this.trigger.death){
                switch(this.name){
                    case 'Mystery': case 'Mystery Boss':
                        entities.enemies.push(new enemy(this.layer,this.position.x,this.position.y,findName(this.spawns[floor(random(0,this.spawns.length))],types.enemy),this.id,{
                            path:this.movement.path,
                            position:this.movement.position,
                            progress:this.movement.progress,
                            totalProgress:this.movement.totalProgress-50,
                        },this.snap))
                    break
                    case 'Boomer':
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,2,[85,165,125],35,0))
                        for(let a=0,la=entities.towers.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.towers[a].position.x,entities.towers[a].position.y)<140){
                                entities.towers[a].applyStun(180,0)
                            }
                        }
                    break
                    case 'Health Cultist':
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,2,[80,255,80],31.25,0))
                        for(let a=0,la=entities.enemies.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.enemies[a].position.x,entities.enemies[a].position.y)<125&&entities.enemies[a].life<=10000){
                                entities.enemies[a].speed*=1.5
                                entities.enemies[a].recall.speed*=1.5
                            }
                        }
                    break
                    case 'Splatter':
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,2,[190,200,195],70,0))
                        for(let a=0,la=entities.towers.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.towers[a].position.x,entities.towers[a].position.y)<280){
                                entities.towers[a].applyStun(240,0)
                            }
                        }
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