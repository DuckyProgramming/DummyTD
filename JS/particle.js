class particle extends entity{
    constructor(layer,x,y,type,color,size,direction){
        super(layer,x,y,type)
        this.color=color
        this.size=size
        this.direction=direction
        switch(this.type){
            case 1:
                this.scale=1
                this.fade=1
            break
            case 2: case 3:
                this.scale=0
                this.fade=1
            break
            case 4:
                this.fade=0
                this.scale=1
                this.trigger=false
            break
        }
    }
    display(){
        this.layer.push()
        this.layer.translate(this.position.x,this.position.y)
        this.layer.scale(this.size*this.scale)
        this.layer.rotate(this.direction)
        this.layer.noStroke()
        switch(this.type){
            case 1:
                this.layer.fill(this.color[0],this.color[1],this.color[2],this.fade)
                this.layer.ellipse(0,0,10,10)
            break
            case 2:
                this.layer.stroke(this.color[0],this.color[1],this.color[2],this.fade)
                this.layer.strokeWeight(0.8)
                this.layer.noFill()
                this.layer.ellipse(0,0,10,10)
            break
            case 3:
                this.layer.stroke(this.color[0],this.color[1],this.color[2],this.fade)
                this.layer.strokeWeight(0.4)
                this.layer.noFill()
                this.layer.ellipse(0,0,10,10)
            break
            case 4:
                this.layer.fill(0,205,255,this.fade)
                this.layer.noStroke()
                this.layer.beginShape()
                this.layer.vertex(0.5,-10)
                this.layer.vertex(-4,1.5)
                this.layer.vertex(0.5,1.5)
                this.layer.vertex(-0.5,10)
                this.layer.vertex(4,-1.5)
                this.layer.vertex(-0.5,-1.5)
                this.layer.endShape()
            break;
        }
        this.layer.pop()
    }
    update(){
        super.update()
        switch(this.type){
            case 1:
                this.scale-=1/60
                this.fade-=1/30
                this.position.x+=lsin(this.direction)*this.size
                this.position.y+=lcos(this.direction)*this.size
                if(this.fade<=0){
                    this.remove=true
                }
            break
            case 2: case 3:
                this.scale+=1/60
                this.fade-=1/60
                if(this.fade<=0){
                    this.remove=true
                }
            break
            case 4:
                this.position.y--
                if(this.trigger){
                    this.fade-=1/30
                    if(this.fade<=0){
                        this.remove=true
                    }
                }else{
                    this.fade+=1/30
                    if(this.fade>=1){
                        this.trigger=true
                    }
                }
            break
        }
    }
}