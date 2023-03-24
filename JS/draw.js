function draw(){
    clear()
    background(125)
    graphics.main.push()
    switch(stage.scene){
        case 'level':
            graphics.main.image(graphics.backgrounds[game.map],0,0,graphics.main.width,graphics.main.height)
            for(let a=0,la=run.fore.length;a<la;a++){
                for(let b=0,lb=run.fore[a].length;b<lb;b++){
                    run.fore[a][b].display()
                    for(let c=0;c<game.speed;c++){
                        run.fore[a][b].update()
                        if(run.fore[a][b].remove){
                            run.fore[a].splice(b,1)
                        }
                    }
                }
            }
            for(let a=0,la=run.info.length;a<la;a++){
                for(let b=0,lb=run.info[a].length;b<lb;b++){
                    run.info[a][b].display()
                }
            }
            entities.spawner.update()
            entities.ui.display()
        break
    }
    graphics.main.pop()
    stage.scale=min(width/graphics.main.width,height/graphics.main.height)
    displayTransition(graphics.main,transition)
    image(graphics.main,width/2-stage.scale*graphics.main.width/2,height/2-stage.scale*graphics.main.height/2,stage.scale*graphics.main.width,stage.scale*graphics.main.height)
    updateMouse(graphics.main)
    game.timer++
}