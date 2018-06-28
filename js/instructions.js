var strings = [
  "Navigate the surfer through 5 stages",
  "Avoid the lighthouses and collect all other items",
  "The more items you collect the bigger your discount"  
];

var introMusic;

var Instructions = {

    preload: function () {
        game.stage.backgroundColor = "#40a2da";
        game.scale.refresh();

        this.load.path = 'assets/';
        this.load.spritesheet('play', 'btn-play.png', 177, 82, 2);

        this.load.audio('introMusic', 'music/'+settings.plaform+'/boogie.mp3');

        //loading text
        textStyle = {
            font: '32px Arial',
            fill: '#ffffff',
            align: 'center',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };

        loadingText = game.add.text(game.world.centerX, game.world.centerY, 'Loading...', textStyle);
        loadingText.anchor.set(0.5);

        this.load.bitmapFont('blanch');
        this.load.spritesheet('logos', 'band-logos.png', 300, 300, 5);
        this.load.image('sea', 'sea.png');
    },

    create: function () {

    
        loadingText.destroy();

        var sea = game.add.sprite(0, game.height, 'sea');
        sea.anchor.set(0, 1);

        introMusic = game.add.audio('introMusic');
        introMusic.play();

        var ribbon = this.add.bitmapText(game.world.centerX, 0, 'blanch', 'How to play!', 64);
        ribbon.anchor.set(0.5, 0);

        //Add instruction text
        var txt;
        var instructionStart = (game.world.centerY-100);
        strings.forEach(function(line, idx) {
            txt = game.add.bitmapText(game.world.centerX, instructionStart+(50*idx), 'blanch', line, 42);
            txt.anchor.set(0.5, 0);
        });

        //add a play button
        var playButton = game.add.sprite(game.world.centerX, game.height-100, 'play');
        playButton.anchor.set(0.5, 0);
        playButton.inputEnabled = true;
        
        
        playButton.events.onInputOver.add(function(){
            playButton.frame = 1;
        }, this);
        playButton.events.onInputOut.add(function(){
            playButton.frame = 0;
        }, this);
        playButton.events.onInputDown.add(function(){
            game.state.start('PlayerSelection');
        }, this);


        gtag('event', 'Instructions Stage');
 
    },

    update: function () {

    }
};