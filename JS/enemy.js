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
        }
        for(let a=0,la=this.attachments.length;a<la;a++){
            switch(this.attachments[a].name){
                case 'FallenRusherArms': case 'FallenRusherShield':
                    this.anim.attachments.push({main:0})
                break
                case 'Leg1Flash': case 'Leg2Flash': case 'Arm1Flash': case 'Arm2Flash': case 'BodyFlash':
                    this.anim.attachments.push({possibilities:[[200,0,255],[0,100,200],[0,150,255],[255,150,50],[255,75,255],[50,255,50],[125,255,125],[255,255,100],[180,180,180],[255,100,100]]})
                    this.attachments[a].color=this.anim.attachments[a].possibilities[floor(random(0,this.anim.attachments[a].possibilities.length))]
                break
                case 'Shocks':
                    this.anim.attachments.push({shocks:[[random(0,360),random(15,50),1],[random(0,360),random(15,50),0.8],[random(0,360),random(15,50),0.6],[random(0,360),random(15,50),0.4],[random(0,360),random(15,50),0.2]]})
                break
                case 'LeadBalloon':
                    this.anim.attachments.push({direction:[0,120,240],radius:24,state:0})
                break
                case 'TemplarShield':
                    this.anim.attachments.push({main:0})
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
    display(){
        this.layer.push()
        this.layer.translate(this.position.x+this.offset.position.x,this.position.y+this.offset.position.x)
        this.layer.rotate(this.direction+this.anim.direction)
        this.layer.scale(this.size)
        switch(this.type){
            default:
                for(let a=0,la=this.attachments.length;a<la;a++){
                    this.layer.noStroke()
                    switch(this.attachments[a].name){
                        case 'Body': case 'BodyFlash':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(0,0,24,24)
                        break
                        case 'Arms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-15,0,12,12)
                            this.layer.ellipse(15,0,12,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
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
                            this.layer.rotate(lsin(this.rates.main*4)*20)
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
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'Body-Transparent':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.ellipse(0,0,24,24)
                        break
                        case 'Arms-Transparent':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade*this.attachments[a].color[3])
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-15,0,12,12)
                            this.layer.ellipse(15,0,12,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
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
                            this.layer.ellipse(-15,this.anim.hand,12,12)
                            this.layer.ellipse(15,0,12,12)
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
                            this.layer.noFill()
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
                            this.layer.quad(-13,-6,-13,6,-15,6,-15,-6)
					        this.layer.quad(13,-6,13,6,15,6,15,-6)
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
                            this.layer.ellipse(-15,0,12,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'Arm2Flash':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(15,0,12,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                        break
                        case 'Leg1Flash':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(-5,(lsin(this.rates.main*4))*7,12,12)
                        break
                        case 'Leg2Flash':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(5,(lsin(this.rates.main*4))*-7,12,12)
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
                            this.layer.ellipse(15,0,12,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
                            this.layer.ellipse(-8,11,12,12)
                        break
                        case 'TemplarArmBands':
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
                            this.layer.noFill()
                            for(let a=0,la=4;a<la;a++){
                                this.layer.arc(0,0,48,48,-30+a*90,30+a*90)
                            }
                            this.layer.stroke(125,105,0,this.fade*this.anim.shield)
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








                    }
                    /*case 'Body':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.ellipse(0,0,24,24)
                        break
                        case 'Arms':
                            this.layer.fill(this.attachments[a].color[0],this.attachments[a].color[1],this.attachments[a].color[2],this.fade)
                            this.layer.rotate(lsin(this.rates.main*4)*20)
                            this.layer.ellipse(-15,0,12,12)
                            this.layer.ellipse(15,0,12,12)
                            this.layer.rotate(lsin(this.rates.main*4)*-20)
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
                        case 'MathArms':
                            this.layer.ellipse(-15*lcos(lsin(this.rates.main*4)*20),-15*lsin(lsin(this.rates.main*4)*20),12,12)
                            this.layer.ellipse(15*lcos(lsin(this.rates.main*4)*20),15*lsin(lsin(this.rates.main*4)*20),12,12)
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
        this.layer.text(max(0,ceil(convert(this.life)))+"/"+max(0,ceil(convert(this.base.life))),0,0.5)
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
                    case 'Shocks':
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
            }
            if(this.activated){
                switch(this.name){
                    case 'Fallen Reaper':
                        this.operation.timer++
                        if(this.operation.timer%510<60){
                            this.anim.hand+=this.operation.timer%510<=30?0.35:-0.35
                            this.speed=0
                            if(this.operation.timer%510==30){
                                this.summonPosition(floor(random(2,4)),30,this.spawns)
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
                            entities.particles.push(new particle(this.layer,this.position.x,this.position.y,3,[105,255,255],20,0))
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
                }
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
                        }))
                    break
                    case 'Boomer':
                        entities.particles.push(new particle(this.layer,this.position.x,this.position.y,2,[85,165,125],30,0))
                        for(let a=0,la=entities.towers.length;a<la;a++){
                            if(dist(this.position.x,this.position.y,entities.towers[a].position.x,entities.towers[a].position.y)<140){
                                entities.towers[a].applyStun(180,0)
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