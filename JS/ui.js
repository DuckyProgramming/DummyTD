class ui{
    constructor(layer){
        this.layer=layer

        this.towers=[]
        this.towerData=[]
        this.towerNumber=0

        this.place={index:-1,lastIndex:-1,tower:0,id:0}

        this.generateTowerData(game.towers)
    }
    generateTowerData(towers){
        this.towers=copyArray(towers)
        this.towerNumber=this.towers.length
        for(let a=0,la=this.towers.length;a<la;a++){
            this.towerData.push({name:types.tower[this.towers[a]].name,levels:types.tower[this.towers[a]].levels})
        }
    }
    display(){
        this.layer.fill(120)
        this.layer.noStroke()
        this.layer.rect(this.layer.width-50,this.layer.height/2,100,this.layer.height)
        this.layer.fill(160)
        for(let a=0,la=this.towerNumber;a<la;a++){
            this.layer.rect(this.layer.width-50,96+a*40,80,30,5)
        }
        this.layer.fill(0)
        this.layer.textSize(12)
        this.layer.text(`Money:`,this.layer.width-50,12)
        this.layer.text(game.money,this.layer.width-50,24)
        this.layer.text(`Lives:`,this.layer.width-50,36)
        this.layer.text(game.lives,this.layer.width-50,48)
        this.layer.text(`Wave:`,this.layer.width-50,60)
        this.layer.text(entities.spawner.wave,this.layer.width-50,72)
        this.layer.textSize(15)
        for(let a=0,la=this.towerNumber;a<la;a++){
            this.layer.text(this.towerData[a].name,this.layer.width-50,92+a*40)
        }
        this.layer.fill(0)
        this.layer.textSize(10)
        for(let a=0,la=this.towerNumber;a<la;a++){
            this.layer.text(this.towerData[a].levels[0].lcost,this.layer.width-50,104+a*40)
        }
        if(this.place.lastIndex>=0){
            this.place.tower.anim.selected=1
            this.place.tower.fade=smoothAnim(this.place.tower.fade,this.place.index>=0,0,1,10)
            this.place.tower.position={x:inputs.rel.x,y:inputs.rel.y}
            this.place.tower.display()
        }
    }
    addTower(){
    }
    onClick(mouse){
        if(inputs.rel.x<this.layer.width-100){
            for(let a=0,la=entities.towers.length;a<la;a++){
                entities.towers[a].selected=false
            }
            if(this.place.index>=0){
                let clear=true
                for(let a=0,la=entities.towers.length;a<la;a++){
                    if(dist(entities.towers[a].position.x,entities.towers[a].position.y,inputs.rel.x,inputs.rel.y)<this.place.tower.size+entities.towers[a].size){
                        clear=false
                    }
                }
                if(clear&&game.money>=this.towerData[this.place.index].levels[0].lcost){
                    entities.towers.push(new tower(this.layer,inputs.rel.x,inputs.rel.y,this.towers[this.place.index],0,this.place.id))
                    entities.towers[entities.towers.length-1].selected=true
                    game.money-=this.towerData[this.place.index].levels[0].lcost
                    this.place.id++
                    this.place.index=-1
                }
            }else{
                for(let a=0,la=entities.towers.length;a<la;a++){
                    if(dist(entities.towers[a].position.x,entities.towers[a].position.y,inputs.rel.x,inputs.rel.y)<=entities.towers[a].size){
                        entities.towers[a].selected=true
                    }
                }
            }
        }
        for(let a=0,la=this.towerNumber;a<la;a++){
            if(pointInsideBox({position:mouse},{position:{x:this.layer.width-50,y:96+a*40},width:80,height:30})&&game.money>=this.towerData[a].levels[0].lcost){
                if(this.place.index==a){
                    this.place.index=-1
                }else{
                    this.place.index=a
                    this.place.lastIndex=a
                    this.place.tower=new tower(this.layer,inputs.rel.x,inputs.rel.y,this.towers[a],0,-1)
                }
            }
        }
    }
    onKey(key,code){
        if(code==SHIFT){
            game.speed=(game.speed+1)%game.speeds.length
        }
    }
}