function setupGraphics(){
	angleMode(DEGREES)
	textAlign(CENTER,CENTER)
	rectMode(CENTER)
	colorMode(RGB,255,255,255,1)
	setupTrig()
	graphics.main=createGraphics(900,600)
	setupLayer(graphics.main)
	graphics.backgrounds=[]
	for(let a=0;a<2;a++){
		graphics.backgrounds.push(createGraphics(900,600))
		setupLayer(graphics.backgrounds[a])
	}

	//polluted wasteland
	graphics.backgrounds[0].background(30,100,70)
	graphics.backgrounds[0].noStroke()
	graphics.backgrounds[0].fill(80,100,90)
	graphics.backgrounds[0].rect(100,150,44,344,8)
	graphics.backgrounds[0].rect(700,450,44,344,8)
	graphics.backgrounds[0].rect(200,300,44,444,8)
	graphics.backgrounds[0].rect(400,300,44,444,8)
	graphics.backgrounds[0].rect(600,300,44,444,8)
	graphics.backgrounds[0].rect(400,100,444,44,8)
	graphics.backgrounds[0].rect(400,300,644,44,8)
	graphics.backgrounds[0].rect(400,500,444,44,8)
	graphics.backgrounds[0].fill(50,80,65)
	graphics.backgrounds[0].ellipse(300,200,100,100)
	graphics.backgrounds[0].ellipse(500,200,100,100)
	graphics.backgrounds[0].ellipse(300,400,100,100)
	graphics.backgrounds[0].ellipse(500,400,100,100)
}
function setupTrig(){
	for(let a=0,la=180;a<la;a++){
		constants.trig[0].push(sin(a))
		constants.trig[1].push(cos(a))
	}
	for(let a=0,la=180;a<la;a++){
		constants.trig[0].push(-constants.trig[0][a])
		constants.trig[1].push(constants.trig[1][179-a])
	}
}
function lsin(direction){
	return constants.trig[0][floor((direction%360+360)%360)]
}
function lcos(direction){
	return constants.trig[1][floor((direction%360+360)%360)]
}