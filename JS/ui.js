class ui{
    constructor(layer){
        this.layer=layer
    }
    display(){
        this.layer.fill(60)
        this.layer.noStroke()
        this.layer.rect(this.layer.width-50,this.layer.height/2,100,this.layer.height)
    }
}