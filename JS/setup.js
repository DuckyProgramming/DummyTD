function setup(){
    createCanvas(windowWidth-50,windowHeight-50)
    setupGraphics()

    setupMap(types.map[game.map])

    entities.spawner=new spawner(graphics.main,[{x:100,y:-100}])
    //entities.spawner.loadWaves(types.wave[game.mode])
    game.speed=1
    entities.ui=new ui(graphics.main)

    run={fore:[entities.particles,entities.projectiles,entities.towers,entities.enemies],info:[entities.towers,entities.enemies]}
}
function windowResized(){
    resizeCanvas(windowWidth-50,windowHeight-50)
}