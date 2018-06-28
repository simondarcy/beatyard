var loadingText;
var Aquaplane = {};
var Preloader = {
    init: function () {
        this.input.maxPointers = 1;
        this.scale.pageAlignHorizontally = true;
    },
    preload: function () {

        game.scale.refresh();

        game.load.onLoadStart.add(this.loadStart, this);
        game.load.onFileComplete.add(this.fileComplete, this);
        game.load.onLoadComplete.add(this.loadComplete, this);

        //Audio
        this.load.audio('music', 'music/'+settings.plaform+'/'+[selectedAct.tune+'.mp3']);
        this.load.audio('coin', ['coin.wav']);
        this.load.audio('splash', ['splash.mp3']);
        //Images
        this.load.images([ 'lighthouse','logo-v2', 'boat-new', 'blades', 'end-logo', 'discount-bgr', 'facebook', 'twitter', 'whatsapp', 'link', 'score-bgr' ]);
        this.load.images([ 'collectable-ball', 'collectable-pizza' , 'collectable-vinyl', 'collectable-duck']);

        if(!settings.isMobile){
            this.load.image('BYlogo', 'logo.png');
        }

        //load band image
        this.load.image('band', 'band-pics/' + selectedAct.key + '.jpg');

        //Sprite sheets
        this.load.spritesheet('waves', 'waves-2.png', 16, 6);
        this.load.spritesheet('buoy', 'buoy.png', 300, 300, 5);
        //buttons
        this.load.spritesheet('claim', 'btn-claim.png', 177, 82, 2);
        this.load.spritesheet('play-again', 'btn-play-again.png', 177, 82, 2);
        //game pad
        this.load.atlas('dpad', 'virtualjoystick/skins/dpad.png', 'virtualjoystick/skins/dpad.json');

        //loading text
        textStyle = {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        loadingText = game.add.text(game.world.centerX, game.world.centerY, 'Loading', textStyle);
        loadingText.anchor.set(0.5);

        //loading text
        textStyle = {
            font: '26px Arial',
            fill: '#ffffff',
            align: 'center',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        introText = game.add.text(game.world.centerX, loadingText.y+50, settings.introMessage, textStyle);
        introText.anchor.set(0.5);

        game.load.start();
    },
    loadStart : function(){
        loadingText.setText("Loading ...");
    },
    loadComplete : function(){
        this.state.start('Aquaplane.Game');
        //this.state.start('GameOver');
    },
    fileComplete : function(progress, cacheKey, success, totalLoaded, totalFiles){
        loadingText.setText("Loading: " + progress + "%");
    },
    create: function () {
    }
};
