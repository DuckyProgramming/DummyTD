function mouseClicked(){
    updateMouse(graphics.main)
    switch(stage.scene){
        case 'level':
            entities.ui.onClick(inputs.rel)
        break
    }
}