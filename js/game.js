var percent = 0;
var score = 0;
var coins = 0;
var zones = [
            {name: 'WELCOME', collectables:[], message:""},
            {name: 'STUDIOYARD', collectables:['lighthouse',  'collectable-vinyl',  'collectable-vinyl'], message:"Art, Design, & Tech Installations"}, 
            {name: 'KIDSYARD', collectables:['lighthouse',  'collectable-duck',  'collectable-duck'], message:"Kid friendly activities over the weekend"},
            {name: 'GAMESYARD', collectables:['lighthouse',  'collectable-ball',  'collectable-ball'], message:" Sports & games for adults & kids."},
            {name: 'EATYARD', collectables:['lighthouse',  'collectable-pizza',  'collectable-pizza'], message:"50+ food areas, demos & food competitions"},
            {name: 'MAIN STAGE', collectables:['lighthouse',  'collectable-pizza',  'collectable-ball', 'collectable-duck', 'collectable-vinyl'], message:"Beatyard takes place Aug 3rd - 5th"}
            ];

Aquaplane.Game = function (game) {

    this.lives = 3;
    this.livesText = null;
    this.speed = 420;
    this.lastKey = 0;
    this.ready = false;
    this.layer = null;
    this.boat = null;
    this.skier = null;
    this.rope = null;
    this.timer = null;
    this.itemInterval = { count: 0, min: 0, max: 0 };
    this.pauseKey = null;
    this.debugKey = null;
    this.showDebug = false;
    this.pad;
    this.stick;
    this.zoneTimer = null;
    this.firstPlay = true;

};

Aquaplane.Game.prototype = {

    init: function () {


        game.stage.backgroundColor = "#40a2da";
        score = 0;
        this.lives = 3;
        this.speed = 400;
        this.currentZone = 0;

        this.ready = false;
        this.lastKey = 0;

        this.timer = this.time.create(false);
        this.zoneTimer = this.time.create(false);
        this.itemInterval = settings.itemInterval;

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 0;

        this.showDebug = false;
        this.firstPlay = true;

    },

    create: function () {

    

        //emitter
        this.waterParticle = this.make.bitmapData(2, 2);
        this.waterParticle.rect(0, 0, 2, 2, '#ffffff');
        this.waterParticle.update();
        this.emitter = this.add.emitter(0, 0, 128);
        this.emitter.makeParticles(this.waterParticle);
        this.emitter.gravity = 0;
        this.emitter.setXSpeed(-100, -250);
        this.emitter.setYSpeed(-100, 100);
        this.emitter.setAlpha(1, 0.2, 500);
        this.emitter.flow(500, 20, 2, -1, true);

        //boat
        this.layer = this.add.group();
        this.layer.inputEnableChildren = true;
        this.boat = this.layer.create(0, 0, 'boat-new');
        this.boat.scale.set(settings.boat.scale);
        this.physics.p2.enable(this.boat, false);
        this.boat.body.mass = 1;
        this.boat.body.damping = 0.5;
        this.boat.body.fixedRotation = true;
        this.boat.body.collideWorldBounds = false;
        this.boatBounds = new Phaser.Rectangle(0, 0, 60, 10);

        //skier
        this.skier = this.layer.create(0, 0, 'blades');
        this.skier.scale.set(settings.skier.scale);
        this.physics.p2.enable(this.skier, false);
        this.skier.body.mass = 0.05;
        this.skier.body.damping = 0.5;
        this.skier.body.fixedRotation = true;
        this.skier.body.collideWorldBounds = false;
        this.skierBounds = new Phaser.Rectangle(0, 0, 35, 30);

        var rev = new p2.RevoluteConstraint(this.boat.body.data, this.skier.body.data, {
                localPivotA: [9, 0],
                localPivotB: [2, 0],
                collideConnected: false
            });
        this.physics.p2.world.addConstraint(rev);
        rev.setLimits(this.math.degToRad(-40), this.math.degToRad(40));
        rev.setStiffness(2.0);

        if(isMobile){ //Mobile Only
            this.pad = game.plugins.add(Phaser.VirtualJoystick);
            this.stick = this.pad.addDPad(0, 0, 200, 'dpad');
            this.stick.scale = settings.pad.scale;
            this.stick.alignBottomLeft(settings.pad.offset);
        }
        else{ //Desktop Only
            //beatLogo
            this.BYlogo = game.add.sprite(settings.logoOffset, game.height-settings.logoOffset, 'BYlogo')
            this.BYlogo.scale.set(settings.logoScale);
            this.BYlogo.anchor.set(0, 1);
        }

        /* waves */
        //  Let's create some waves (harmless eye candy)
        //  
        //  Divide screen vertically into 520px / 8 layers = 65px per layer
        //  Place 8 waves per layer (8*8 total)

        var area = new Phaser.Rectangle(0, 0, this.game.width, 0);
        for (var i = 1; i <= 8; i++)
        {
            for (var w = 0; w < 8; w++)
            {
                var wave = this.layer.create(area.randomX, area.randomY, 'waves', this.rnd.between(0, 2));
                wave.anchor.y = -1.5;
                this.physics.arcade.enable(wave);
                wave.body.velocity.x = -120 + (i * -30);
            }

            area.y += 65;
        }

        this.line = new Phaser.Line(this.boat.x - 28, this.boat.y, this.skier.x + 6, this.skier.y - 1);

        //  The rope that attaches the water skier to the boat
        this.rope = this.add.graphics(0, 0);


        /* UI */

        //logo bottom rigtht
        this.logo = game.add.sprite(game.width-settings.logoOffset, game.height-settings.logoOffset, 'logos', selectedAct.frame)
        this.logo.scale.set(settings.logoScale);
        this.logo.anchor.set(1);
    
        //now playing
        this.npTxt = this.add.bitmapText(this.logo.x-settings.npTxt.offset.x, this.logo.y+settings.npTxt.offset.y, 'blanch', 'now playing', settings.npTxt.size);
        this.npTxt.smoothed = false;
        this.npTxt.anchor.set(1);

        this.coinText = this.add.bitmapText(16, settings.uiTextY, 'blanch', 'POINTS: 0', 32);
        this.coinText.smoothed = false;

        this.zoneText = this.add.bitmapText(game.width/2, 0, 'blanch', zones[this.currentZone].name, settings.zoneTitleSize);
        this.zoneText.anchor.x = 0.5;
        
        this.msgText = this.add.bitmapText(game.width/2, game.height-settings.zoneMsgOffset, 'blanch', zones[this.currentZone].message, settings.zoneMsgSize);
        this.msgText.anchor.set(0.5, 1);

        this.livesText = this.add.bitmapText(game.width-16, settings.uiTextY, 'blanch', 'LIVES: ' + this.lives, 32);
        this.livesText.anchor.x = 1;
        this.livesText.smoothed = false;

        this.cursors = this.input.keyboard.createCursorKeys();

        //  Press P to pause and resume the game
        this.pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
        this.pauseKey.onDown.add(this.togglePause, this);

        //  Press D to toggle the debug display
        this.debugKey = this.input.keyboard.addKey(Phaser.Keyboard.D);
        this.debugKey.onDown.add(this.toggleDebug, this);

        this.bringBoatOn();

        //level audio

        if(typeof this.music === "undefined") {
            this.music = game.add.audio('music');
        }
        introMusic.stop();
        this.music.stop();
        this.music.loop = true;
        this.music.play();
        this.coin = game.add.audio('coin');
        this.splash = game.add.audio('splash');
        this.zoneUp();


        //level timer
    
        //  Set a TimerEvent to occur after X
        this.zoneTimer.loop(settings.zoneTimerInterval, function(){ 
            //if final zone, end
            if(this.currentZone==5){
                if(isMobile){
                    this.stick.destroy();
                }
                game.state.start('GameOver')
            }
            else{ //Otherwise update
                this.zoneUp();
            }
        
        }, this);

        //  Start the timer
        this.zoneTimer.start();


        gtag('event', 'Game Stage');
    
    },
    zoneUp:function(){
        this.buoy = game.add.sprite(game.world.width, 50, 'buoy', (this.currentZone))
        this.physics.arcade.enable(this.buoy);
        this.buoy.anchor.set(0);
        this.buoy.scale.set(settings.buoyScale);
        this.buoy.body.velocity.x = -150;
        this.currentZone++;
        this.zoneText.text = zones[this.currentZone].name;
        this.msgText.text = zones[this.currentZone].message;
        //Bit of animation
        tweenA = game.add.tween(this.zoneText.scale).to( { x: 1.5, y: 1.5}, 500, "Quart.easeOut");
        tweenB = game.add.tween(this.zoneText.scale).to( { x: 1, y: 1}, 1000, "Quart.easeOut");
        tweenA.chain(tweenB);
        tweenA.start();
        game.world.bringToTop(this.layer);

        gtag('event', 'stat', {
            'event_category' : 'zone',
            'event_label' : zones[this.currentZone].name
          });
        

    tweenA.chain(tweenB);
    },
    togglePause: function () {

        this.game.paused = (this.game.paused) ? false : true;

    },

    toggleDebug: function () {

        this.showDebug = (this.showDebug) ? false : true;

    },

    bringBoatOn: function () {

        this.ready = false;

        this.boat.body.x = -64;
        this.boat.body.y = game.world.centerY;

        this.skier.visible = true;
        this.skier.body.x = -264;
        this.skier.body.y = game.world.centerY;

        this.boat.body.velocity.x = 300;

    },

    boatReady: function () {

        this.ready = true;
        
        this.boat.body.setZeroVelocity();
        if(this.firstPlay){
            this.firstPlay = false;
            this.timer.add(this.itemInterval.max, this.releaseItem, this);
            this.timer.start();
        }

    },

    releaseItem: function (x, y) {

        if (x === undefined) { x = this.game.width; }
        if (y === undefined) { y = this.rnd.between(80, this.game.height); }

        var frame = this.rnd.pick(zones[this.currentZone].collectables);

        var item = this.layer.getFirstDead(true, x, y, frame);
        
        this.physics.arcade.enable(item);

        
        if(frame === 'lighthouse'){
            item.scale.setTo(settings.lighthouse.scale);
            
        }
        else
        {
            item.scale.setTo(settings.colectables.scale);
            //item.body.setSize(16, 8, 0, 24);
        }

        //item.body.setSize(item.width, item.height);

        var i = this.math.snapToFloor(y, 65) / 65;

        item.body.velocity.x = -120 + (i * -30);


        //  Is the player idle? Then release another item directly towards them
        if ((this.time.time - this.lastKey) > 200)
        {
            this.lastKey = this.time.time;
            this.releaseItem(this.game.width, this.skier.y - 16);
            // console.log("idle hands");
        }
        else
        {
            //randomly release a new item
            this.timer.add(this.rnd.between(this.itemInterval.min, this.itemInterval.max), this.releaseItem, this);
        }

    },

    update: function () {

        this.layer.sort('y', Phaser.Group.SORT_ASCENDING);

        //Kill buoy once its left screen
        if (typeof this.buoy !== 'undefined' && this.buoy.alive && this.buoy.x < -100){
            this.buoy.destroy();
        }

        if (this.ready)
        {
            this.updateBoat();
        }
        else
        {
            if (this.skier.visible)
            {
                if (this.boat.x >= 250)
                {
                    this.boatReady();
                }
            }
            else
            {
                if (this.boat.x >= 832)
                {
                    this.bringBoatOn();
                }
            }
        }

        this.boatBounds.centerOn(this.boat.x + 4, this.boat.y + 8);
        this.skierBounds.centerOn(this.skier.x + 2, this.skier.y + settings.skier.physics.offset);

        this.emitter.emitX = this.boat.x - (this.boat.width/2);
        this.emitter.emitY = this.boat.y + 10;

        //  Let's sort and collide
        this.layer.forEachAlive(this.checkItem, this);


    },

    updateBoat: function () {

        
        if (this.boat.x < 200)
        {
            this.boat.body.setZeroForce();
            this.boat.body.x = 200;
        }
        else if (this.boat.x > 750)
        {
            this.boat.body.setZeroForce();
            this.boat.body.x = 750;
        }

        if (this.boat.y < 10)
        {
            this.boat.body.setZeroForce();
            this.boat.body.y = 10;
        }
        else if (this.boat.y > 550)
        {
            this.boat.body.setZeroForce();
            this.boat.body.y = 550;
        }

        if (this.cursors.left.isDown)
        {
            this.boat.body.force.x = -this.speed;
            this.lastKey = this.time.time;
        }
        else if (this.cursors.right.isDown)
        {
            this.boat.body.force.x = this.speed;
            this.lastKey = this.time.time;
        }

        if (this.cursors.up.isDown)
        {
            this.boat.body.force.y = -this.speed;
            this.lastKey = this.time.time;
        }
        else if (this.cursors.down.isDown)
        {
            this.boat.body.force.y = this.speed;
            this.lastKey = this.time.time;
        }


        //Joystick
        if(isMobile){
            if (this.stick.isDown)
            {
            

                if (this.stick.direction === Phaser.LEFT)
                {
                    this.boat.body.force.x = -this.speed;
                    this.lastKey = this.time.time;
                }
                else if (this.stick.direction === Phaser.RIGHT)
                {
                    this.boat.body.force.x = this.speed;
                    this.lastKey = this.time.time;
                }
                else if (this.stick.direction === Phaser.UP)
                {
                    this.boat.body.force.y = -this.speed;
                    this.lastKey = this.time.time;
                }
                else if (this.stick.direction === Phaser.DOWN)
                {
                    this.boat.body.force.y = this.speed;
                    this.lastKey = this.time.time;
                }
            }
            else
            {
                //console.log('idol');
            }
        }//end if mobile

        //end joystick


    },
    checkItem: function (item) {

        if (item === this.boat || item === this.skier)
        {
            return;
        }

        if (item.x < -32)
        {
            if (item.key === 'waves')
            {
                item.x = this.rnd.between(800, 864);
            }
            else
            {
                item.kill();
            }
        }
        else
        {
            //   Check for collision
            if (this.ready && item.key !== 'waves' && this.skierBounds.intersects(item.body))
            {

                if(item.key === 'lighthouse'){
                    this.loseLife();
                }else {
                    item.destroy();
                    this.coin.play();
                    score++;
                    this.coinText.text = "POINTS: " + score;
                }
            }
        }

    },

    loseLife: function () {

        if (this.lives === 0)
        {
            if(isMobile){
                this.stick.destroy();
            }
            gtag('event', 'Lost all lives');
            this.state.start('GameOver');
        }
        else
        {
            this.lives--;
            this.livesText.text = "LIVES: " + this.lives;
            this.ready = false;
            //  Kill the surfer!
            this.skier.visible = false;
            //  Hide the rope
            this.rope.clear();
            //  Speed the boat away
            this.boat.body.setZeroVelocity();
            this.boat.body.velocity.x = 600;
            this.splash.play();


            //add a splash

            var whiteEmitter = game.add.emitter(0, 0, 100);
            whiteEmitter.makeParticles('waves');
            whiteEmitter.gravity = 200;
            whiteEmitter.x = this.skier.x;
            whiteEmitter.y = this.skier.y;
            if(settings.isMobile){
                whiteEmitter.maxParticleScale = 0.3;
            }
            whiteEmitter.start(true, 4000, null, 10);

            //  And 2 seconds later we'll destroy the emitter
            game.time.events.add(2000, function(){
                whiteEmitter.destroy();
            }, this);

        }

    },
    preRender: function () {

        this.line.setTo(this.boat.x - 28, this.boat.y, this.skier.x + 6, this.skier.y - 1);

        if (this.skier.visible)
        {
            this.rope.clear();
            this.rope.lineStyle(1, 0xffffff, 1);
            this.rope.moveTo(this.line.start.x, this.line.start.y);
            this.rope.lineTo(this.line.end.x, this.line.end.y);
            this.rope.endFill();
        }

    },

    render: function () {

        if (this.showDebug)
        {
            this.game.debug.geom(this.boatBounds);
            this.game.debug.geom(this.skierBounds);
            this.layer.forEachAlive(this.renderBody, this);
            this.game.debug.geom(this.skier.position, 'rgba(255,255,0,1)');
        }

    },

    renderBody: function (sprite) {

        if (sprite === this.boat || sprite === this.skier || sprite.key === 'waves')
        {
            return;
        }

        this.game.debug.body(sprite);

    }

};


