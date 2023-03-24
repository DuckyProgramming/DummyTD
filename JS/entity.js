class entity{
    constructor(layer,x,y,type){
        this.layer=layer
        this.position={x:x,y:y}
        this.type=type
        
        this.fade=0
        this.time=0
        this.remove=false
    }
    update(){
        this.time++
    }
}