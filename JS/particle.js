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
            case 2:
                this.scale=0
                this.fade=1
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
            break
            case 2:
                this.scale+=1/60
                this.fade-=1/60
            break
        }
    }
}