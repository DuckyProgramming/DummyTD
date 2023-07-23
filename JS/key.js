function keyPressed(){
    switch(stage.scene){
        case 'level':
            entities.ui.onKey(key,keyCode)
        break
    }
}