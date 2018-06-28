var mobileSettings = {
    threshold:20,
    introMessage:'Turn up the volume!',
    nameOffset:5,
    itemInterval:{ count: 0, min: 1500, max: 2000 },
    lighthouse:{ scale:0.3 },
    colectables:{ scale:0.3 },
    boat: { scale:0.3 },
    skier: {scale:0.15, physics:{offset:10}},
    pad:{ scale:0.5, offset:10 },
    uiTextY:10,
    npTxt:{offset:{x:15, y:10}, size:16},
    zoneTimerInterval:20000,
    zoneTitleSize:54,
    zoneMsgSize:24,
    zoneMsgOffset:10,
    buoyScale:0.3,
    discountOffset:25,
    endBtnOffset:100,
    logoScale:0.28,
    logoOffset:20,
    shareSpacing:50,
    shareScale:0.65,
    shareOffset:70,
    endLogoOffset:0,
    endLogoScale:0.4,
    endBandScale:0.35,
    endDiscountTXT:70,
    endDiscountScale:0.4,
    endScoreTXT:33,
    endScoreScale:0.45,
    plaform:"mobile",
    isMobile:true
};


var desktopSettings = {
    threshold:30,
    introMessage:'Turn up the speakers!',
    nameOffset:30,
    itemInterval:{ count: 0, min: 900, max: 1500 },
    lighthouse:{ scale:0.4 },
    colectables:{ scale:0.4 },
    boat: { scale:0.4 },
    skier: {scale:0.2, physics:{offset:10}},
    pad:{ scale:0.5, offset:0 },
    uiTextY:14,
    npTxt:{offset:{x:20, y:15}, size:22},
    zoneTimerInterval:20000,
    zoneTitleSize:64,
    zoneMsgSize:30,
    zoneMsgOffset:10,
    buoyScale:0.4,
    discountOffset:50,
    endBtnOffset:100,
    logoScale:0.4,
    logoOffset:20,
    shareSpacing:60,
    shareScale:0.7,
    shareOffset:100,
    endLogoOffset:10,
    endLogoScale:0.6,
    endBandScale:0.5,
    endDiscountScale:0.6,
    endDiscountTXT:100,
    endScoreTXT:46,
    endScoreScale:0.7,
    plaform:"desktop",
    isMobile:false
};


//default to mobile settings
var settings = mobileSettings;


var shareURL = "http://www.the-beatyard.com/game/";
