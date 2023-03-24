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
            speed:this.speed,
            size:this.size,
        }

        this.rates={
            main:0,
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
                    }
                }
            break
        }
        this.layer.pop()
    }
    displayInfo(){
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