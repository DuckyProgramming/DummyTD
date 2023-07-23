class spawner{
    constructor(layer,points){
        this.layer=layer
        this.cacheWaves=[]
        this.waves=[]
        this.wave=0
        this.points=points

        entities.enemies.push(new enemy(this.layer,this.points[0].x,this.points[0].y,types.enemy.length-1,0))
    }
    loadWaves(waves){
        for(let a=0,la=waves.length;a<la;a++){
            this.loadWave(waves[a])
        }
    }
    loadWave(enemies){
        let stack=[]
        for(let a=0,la=enemies.length;a<la;a++){
            for(let b=0,lb=enemies[a].amount;b<lb;b++){
                if(b==lb-1){
                    stack.push({type:findName(enemies[a].name,types.enemy),delay:enemies[a].endDelay})
                }else{
                    stack.push({type:findName(enemies[a].name,types.enemy),delay:enemies[a].delay})
                }
            }
        }
        this.cacheWaves.push({enemies:stack,timer:0,tick:0})
    }
    update(){
        if(this.waves.length==0&&entities.enemies.length==0&&this.cacheWaves.length>0){
            this.waves.push(this.cacheWaves[0])
            this.cacheWaves.splice(0,1)
            this.wave++
        }
        for(let a=0,la=this.waves.length;a<la;a++){
            if(this.waves[a].enemies.length>0){
                if(this.waves[a].timer>0){
                    this.waves[a].timer--
                }else{
                    entities.enemies.push(new enemy(this.layer,this.points[this.waves[a].tick%this.points.length].x,this.points[this.waves[a].tick%this.points.length].y,this.waves[a].enemies[0].type,this.waves[a].tick))
                    this.waves[a].tick++
                    this.waves[a].timer=this.waves[a].enemies[0].delay
                    this.waves[a].enemies.splice(0,1)
                }
            }else{
                if(this.waves[a].timer>0){
                    this.waves[a].timer--
                }else{
                    this.waves.splice(a,1)
                    a--
                    la--
                }
            }
        }
    }
}