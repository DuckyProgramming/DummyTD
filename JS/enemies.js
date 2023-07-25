types.enemy=[
    {
        name:'',
        life:0,shield:0,defense:0,
        speed:1,stun:1,
		size:1,hidden:false,
        multi:1,
		attachments:[
            {name:'Legs',color:[0,0,0]},
            {name:'Arms',color:[0,0,0]},
            {name:'Body',color:[0,0,0]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Normal',
        life:5,shield:0,defense:0,
        speed:1,stun:1,
		size:1,hidden:false,
        multi:1,
		attachments:[
            {name:'Legs',color:[120,60,0]},
            {name:'Arms',color:[100,200,100]},
            {name:'Body',color:[100,200,100]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Quick',
        life:4,shield:0,defense:0,
        speed:2,stun:1,
		size:1,hidden:false,
        multi:1,
		attachments:[
            {name:'Legs',color:[120,60,0]},
            {name:'Arms',color:[150,200,255]},
            {name:'Body',color:[150,200,255]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Hefty',
        life:15,shield:0,defense:1,
        speed:0.6,stun:1,
		size:1,hidden:false,
        multi:1,
		attachments:[
            {name:'Legs',color:[75,75,75]},
            {name:'Arms',color:[135,135,135]},
            {name:'Body',color:[135,135,135]},
            {name:'Armchain',color:[50,50,50]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Hidden',
        life:10,shield:0,defense:0,
        speed:1,stun:1,
		size:1,hidden:true,
        multi:1,
		attachments:[
            {name:'Legs',color:[40,40]},
            {name:'Arms',color:[65,65,65]},
            {name:'Body',color:[65,65,65]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Normal Boss',
        life:160,shield:0,defense:0,
        speed:0.7,stun:0.5,
		size:1.4,hidden:false,
        multi:1,
		attachments:[
            {name:'Legs',color:[50,50,50]},
            {name:'Arms',color:[65,160,65]},
            {name:'Body',color:[65,160,65]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Mystery',
        life:20,shield:0,defense:0,
        speed:1.1,stun:1,
		size:1,hidden:false,
        multi:2,
		attachments:[
            {name:'Legs-Transparent',color:[0,100,0,0.2]},
            {name:'Arms-Transparent',color:[0,200,0,0.6]},
            {name:'Body-Transparent',color:[0,200,0,0.6]},
            {name:'Mouth-Transparent',color:[255,255,255,0.4]},
            {name:'Eyes-Transparent',color:[255,255,255,0.4]},
            {name:'Question-Transparent',color:[255,255,255,0.8]},
        ],
    },{
        name:'Lead Boss',
        life:200,shield:0,defense:0,
        speed:0.65,stun:0.5,
		size:1.4,hidden:false,
        multi:2,
		attachments:[
            {name:'Legs',color:[150,75,0]},
            {name:'Legs-Varying',color:[50,50,50,-1,1]},
            {name:'Arms',color:[200,225,255]},
            {name:'Arms-Varying',color:[50,50,50,-1,1]},
            {name:'ArmsDiamondPlate-Varying',color:[30,30,30,-1,1]},
            {name:'Body',color:[200,225,255]},
            {name:'Body-Varying',color:[50,50,50,-1,1]},
            {name:'BodyDiamondPlate-Varying',color:[30,30,30,-1,1]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Fallen Reaper',
        life:400,shield:0,defense:0,
        speed:0.8,stun:0.25,
		size:1.4,hidden:false,
        multi:1.5,
		attachments:[
            {name:'Legs',color:[0,30,45]},
            {name:'Body',color:[80,65,50]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
            {name:'Scythe',color:[[130,65,0],[200,200,200]]},
            {name:'OneMovedArms',color:[0,30,45]},
            {name:'Cloak',color:[0,30,45]},
        ],
    },{
        name:'Fallen',
        life:122,shield:0,defense:0,
        speed:1.5,stun:0.75,
		size:1,hidden:false,
        multi:1,
		attachments:[
            {name:'Legs',color:[0,30,45]},
            {name:'FallenArms',color:[0,40,60]},
            {name:'FallenBody',color:[0,40,60]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Chained Boss',
        life:1500,shield:0,defense:3,
        speed:0.45,stun:0.25,
		size:1.8,hidden:false,
        multi:1,
		attachments:[
            {name:'ChainRust',color:[150,60,15]},
            {name:'Legs',color:[65,65,65]},
            {name:'Arms',color:[60,150,60]},
            {name:'Body',color:[60,150,60]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[255,235,0]},
            {name:'Chained',color:[150,150,150]},
        ],
    },{
        name:'Shadow Boss',
        life:550,shield:0,defense:0,
        speed:1.25,stun:1,
		size:1.6,hidden:true,
        multi:1,
		attachments:[
            {name:'Legs',color:[15,15,15]},
            {name:'HiddenString',color:[20,20,20]},
            {name:'Arms',color:[20,20,20]},
            {name:'Body',color:[20,20,20]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[235,235,235]},
        ],
    },{
        name:'Fallen Rusher',
        life:222,shield:0,defense:0,
        speed:1.5,stun:0.75,
		size:1,hidden:false,
        multi:1,
		attachments:[
            {name:'Legs',color:[5,0,45]},
            {name:'FallenRusherShield',color:[[55,55,55],[255,200,220]],metric:[0.875]},
            {name:'FallenRusherArms',color:[4,0,36],metric:[0.875]},
            {name:'FallenBody',color:[4,0,36]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Boomer',
        life:1750,shield:0,defense:0,
        speed:0.65,stun:0.5,
		size:1.75,hidden:false,
        multi:1.25,
		attachments:[
            {name:'Legs',color:[80,120,100]},
            {name:'Arms',color:[100,150,125]},
            {name:'Body',color:[100,150,125]},
            {name:'SmallBody',color:[80,120,100]},
            {name:'SmallMouth',color:[0,0,0]},
            {name:'SmallEyes',color:[0,0,0]},
        ],
    },{
        name:'Mega Speedy',
        life:1000,shield:0,defense:5,
        speed:1.5,stun:0.25,
		size:1.75,hidden:false,
        multi:1.25,
		attachments:[
            {name:'Legs',color:[50,90,130]},
            {name:'Arms',color:[100,175,255]},
            {name:'ArmbandsQuad',color:[50,50,50]},
            {name:'Body',color:[100,175,255]},
            {name:'LightningImprint',color:[70,155,215]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Mystery Boss',
        life:200,shield:0,defense:0,
        speed:1,stun:0.5,
		size:1.4,hidden:false,
        multi:4,
		attachments:[
            {name:'Legs-Transparent',color:[0,50,100,0.2]},
            {name:'Arms-Transparent',color:[0,100,200,0.6]},
            {name:'Body-Transparent',color:[0,100,200,0.6]},
            {name:'Mouth-Transparent',color:[255,255,255,0.4]},
            {name:'Eyes-Transparent',color:[255,255,255,0.4]},
            {name:'Question-Transparent',color:[255,255,255,0.8]},
        ],
    },{
        name:'Glitch',
        life:220,shield:0,defense:0,
        speed:5,stun:0.75,
		size:1,hidden:false,
        multi:1,
		attachments:[
            {name:'Leg1Flash',color:[0,0,0]},
            {name:'Leg2Flash',color:[0,0,0]},
            {name:'Arm1Flash',color:[0,0,0]},
            {name:'Arm2Flash',color:[0,0,0]},
            {name:'BodyFlash',color:[0,0,0]},
            {name:'Mouth',color:[255,255,255]},
            {name:'Eyes',color:[255,255,255]},
        ],
    },{
        name:'Circuit',
        life:700,shield:0,defense:0,
        speed:1.5,stun:0.5,
		size:1,hidden:false,
        multi:5,
		attachments:[
            {name:'Shocks',color:[0,205,255]},
            {name:'Legs',color:[0,175,255]},
            {name:'Arms',color:[0,205,255]},
            {name:'Body',color:[0,205,255]},
            {name:'Mouth',color:[105,255,255]},
            {name:'AngerEyes',color:[105,255,255]},
            {name:'Eyes',color:[105,255,255]},
        ],
    },{
        name:'Lead Balloon',
        life:320,shield:0,defense:0,
        speed:2,stun:0.75,
		size:1,hidden:false,
        multi:2,
		attachments:[
            {name:'Legs',color:[120,50,10]},
            {name:'Arms',color:[150,60,15]},
            {name:'Body',color:[35,120,35]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
            {name:'LeadBalloon',color:[[100,100,100],[120,120,120],[60,60,60]]},
        ],
    },{
        name:'Templar',
        life:5000,shield:0,defense:0,
        speed:0.85,stun:0.25,
		size:1.5,hidden:false,
        multi:4,
		attachments:[
            {name:'Legs',color:[130,130,130]},
            {name:'TemplarGun',color:[[255,0,0],[10,10,10],[30,30,30]]},
            {name:'TemplarArms',color:[160,160,160]},
            {name:'TemplarArmBands',color:[80,80,80]},
            {name:'Body',color:[160,160,160]},
            {name:'Mouth',color:[0,0,0]},
            {name:'TemplarVisor',color:[[0,0,0],[255,0,0]]},
            {name:'TemplarShield',color:[[255,215,0],[125,105,0]]},
        ],
    },{
        name:'Slow King',
        life:4000,shield:1000,defense:0,
        speed:0.65,stun:0.25,
		size:1.55,hidden:false,
        multi:1.25,
		attachments:[
            {name:'Legs',color:[20,20,20]},
            {name:'SlowKingCape',color:[15,15,15]},
            {name:'Arms',color:[20,75,20]},
            {name:'SlowKingArmbands',color:[25,25,25]},
            {name:'Body',color:[20,75,20]},
            {name:'SlowKingTumor',color:[20,75,20]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[180,20,120]},
            {name:'SlowKingShield',color:[180,20,120]},
        ],
    },{
        name:'Soul',
        life:800,shield:0,defense:0,
        speed:1.45,stun:0.5,
		size:1,hidden:true,
        multi:1,
		attachments:[
            {name:'Legs-Transparent',color:[120,120,120,0.2]},
            {name:'Arms-Transparent',color:[255,255,255,0.6]},
            {name:'Body-Transparent',color:[255,255,255,0.6]},
            {name:'Mouth',color:[120,120,120]},
            {name:'Eyes',color:[120,120,120]},
        ],
    },{
        name:'Soul Boss',
        life:3500,shield:0,defense:0,
        speed:0.95,stun:0.15,
		size:1.5,hidden:true,
        multi:1,
		attachments:[
            {name:'Legs-Transparent',color:[120,120,120,0.2]},
            {name:'Arms-Transparent',color:[255,255,255,0.6]},
            {name:'Wings-Transparent',color:[255,255,255,0.4]},
            {name:'Body-Transparent',color:[255,255,255,0.6]},
            {name:'Mouth',color:[120,120,120]},
            {name:'Eyes',color:[120,120,120]},
            {name:'Halo',color:[255,255,35]},
        ],
    },{
        name:'Health Cultist',
        life:6000,shield:0,defense:4,
        speed:1.2,stun:0.25,
		size:1,hidden:false,
        multi:2,
		attachments:[
            {name:'Legs',color:[45,160,45]},
            {name:'Arms',color:[50,175,50]},
            {name:'Body',color:[60,210,60]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
            {name:'CloakClasp',color:[55,190,55]},
            {name:'HealthCultistLines',color:[100,255,100]},
            {name:'HealthCultistLoop-Transparent',color:[70,240,70]},
        ],
    },{
        name:'SCT',
        life:6666,shield:0,defense:0,
        speed:1.875,stun:0.15,
		size:1,hidden:false,
        multi:1.25,
		attachments:[
            {name:'Gun',color:[40,40,40]},
            {name:'Legs',color:[0,25,0]},
            {name:'FallenGunArms',color:[0,30,0]},
            {name:'GunArmBands',color:[10,10,10]},
            {name:'FallenBody',color:[0,35,0]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Sunglasses',color:[0,0,0]},
        ],
    },

















    /*{
        name:'',
        life:0,shield:0,defense:0,
        speed:1,stun:1,
		size:1,hidden:false,
        multi:1,
		attachments:[
            {name:'Legs',color:[0,0,0]},
            {name:'Arms',color:[0,0,0]},
            {name:'Body',color:[0,0,0]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Normal',
        life:5,shield:0,defense:0,
        speed:1,stun:1,
		size:1,hidden:false,
        multi:1,
		attachments:[
            {name:'Legs',color:[120,60,0]},
            {name:'Arms',color:[100,200,100]},
            {name:'Body',color:[100,200,100]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },{
        name:'Fallen',
        life:122,shield:0,defense:0,
        speed:1.5,stun:0.75,
		size:1,hidden:false,
        multi:1,
		attachments:[
            {name:'Legs',color:[0,30,45]},
            {name:'FallenArms',color:[0,40,60]},
            {name:'FallenBody',color:[0,40,60]},
            {name:'Mouth',color:[0,0,0]},
            {name:'Eyes',color:[0,0,0]},
        ],
    },*/
]