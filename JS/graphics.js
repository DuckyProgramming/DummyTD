function setupGraphics(){
	angleMode(DEGREES)
	textAlign(CENTER,CENTER)
	rectMode(CENTER)
	colorMode(RGB,255,255,255,1)
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