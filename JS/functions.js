function setupLayer(layer){
	layer.noStroke()
    layer.angleMode(DEGREES)
	layer.textAlign(CENTER,CENTER)
	layer.rectMode(CENTER)
	layer.colorMode(RGB,255,255,255,1)
}
function displayTransition(layer,transition){
	layer.noStroke()
	layer.fill(0)
	layer.rect(transition.anim*layer.width/4,layer.height/2,transition.anim*layer.width/2,layer.height)
	layer.rect(layer.width-transition.anim*layer.width/4,layer.height/2,transition.anim*layer.width/2,layer.height)
	layer.rect(layer.width/2,transition.anim*layer.height/4,layer.width,transition.anim*layer.height/2)
	layer.rect(layer.width/2,layer.height-transition.anim*layer.height/4,layer.width,transition.anim*layer.height/2)
	if(transition.trigger){
		transition.anim=round(transition.anim*10+1)/10
		if(transition.anim>1.1){
			transition.trigger = false
			stage.scene=transition.scene
		}
	}
	else if(transition.anim>0){
		transition.anim=round(transition.anim*10-1)/10
	}
}
function directionValue(start,target,bound){
	if(abs(target-start)<bound||abs(target-start-360)<bound||abs(target-start+360)<bound||abs(target-start-720)<bound||abs(target-start+720)<bound){
		return 0
	}else if(start>target-180&&start<target||start>target-540&&start<target-360||start>target+180&&start<target+360||start>target-900&&start<target-720||start>target+540&&start<target+720){
		return 1
	}else if(start>target&&start<target+180||start>target-360&&start<target-180||start>target+360&&start<target+540||start>target-720&&start<target-540||start>target+720&&start<target+900){
		return 2
	}
}
function findName(name,list){
	for(let a=0,la=list.length;a<la;a++){
		if(list[a].name==name){
			return a
		}
	}
}
function convert(value){
	if(value>=10000){
		return max(0,round(value/100)/10)+'K'
	}
	return max(0,ceil(value))
}
function pointInsideBox(point,box){
	return point.position.x>box.position.x-box.width/2&&point.position.x<box.position.x+box.width/2&&point.position.y>box.position.y-box.height/2&&point.position.y<box.position.y+box.height/2
}
function kill(index){
	if(entities.enemies.length>0){
		entities.enemies[constrain(index,0,entities.enemies.length-1)].life=0
	}
}
function copyArray(base){
	let list=[]
	for(let a=0,la=base.length;a<la;a++){
		list.push(base[a])
	}
	return list
}
function copyArrayStack(base){
	let list=[]
	for(let a=0,la=base.length;a<la;a++){
		list.push([])
		for(let b=0,lb=base[a].length;b<lb;b++){
			list[a].push(base[a][b])
		}
	}
	return list
}
function smoothAnim(anim,trigger,minPoint,maxPoint,speed){
	if(trigger&&anim<maxPoint){
		return min(round(anim*speed+1)/speed,maxPoint)
	}
	if(!trigger&&anim>minPoint){
		return max(round(anim*speed-1)/speed,minPoint)
	}
	return anim
}
function setupMap(map){
	game.path=[]
	let path=''
	for(let a=0,la=map.path.length;a<la;a++){
		for(let b=0,lb=map.path[a].length;b<lb;b++){
			if(b>0&&map.path[a][b-1]!=map.path[a][b]){
				path+='T'
			}
			path+=map.path[a][b]
		}
		game.path.push(path)
	}
}
function updateMouse(layer){
	inputs.mouse.x=mouseX
	inputs.mouse.y=mouseY
	inputs.rel.x=(inputs.mouse.x-width/2)/stage.scale+layer.width/2
	inputs.rel.y=(inputs.mouse.y-height/2)/stage.scale+layer.height/2
}
function sortEnemies(type,enemies){
	switch(type){
		case 0:
			let maximum=-1000
			let list=[]
			let sorted=[]
			for(let a=0,la=enemies.length;a<la;a++){
				list.push(a)
			}
			for(let a=0,la=list.length;a<la;a++){
				if(list.length>0){
					for(let a=0,la=list.length;a<la;a++){
						maximum=max(maximum,enemies[list[a]].movement.totalProgress)
					}
					for(let a=0,la=list.length;a<la;a++){
						if(enemies[list[a]].movement.totalProgress==maximum){
							sorted.push(list[a])
							list.splice(a,1)
							a--
							la--
						}
					}
					maximum=-1000
				}else{
					la=0
				}
			}
			return sorted
	}
}
function kill(){
	for(let a=0,la=entities.enemies.length;a<la;a++){
		entities.enemies[a].life=0
	}
}
function spawn(name){
	entities.spawner.quickSpawn(findName(name,types.enemy))
}