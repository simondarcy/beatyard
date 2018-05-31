var percent = 0;
var zone=0;
var lives = 3;
var coins = 0;
zones = ['EATYARD', 'KIDSYARD', 'STUDIOYARD', 'MAIN STAGE'];

Aquaplane.Preloader = function () {};

Aquaplane.Preloader.prototype = {

    init: function () {

        this.input.maxPointers = 1;

        this.scale.pageAlignHorizontally = true;

    },

    preload: function () {

        game.scale.refresh();

        this.load.path = 'assets/';

        this.load.bitmapFont('fat-and-tiny');
        this.load.bitmapFont('interfont');

        this.load.audio('music', ['music.mp3']);
        this.load.audio('coin', ['coin.wav']);

        this.load.images([ 'lighthouse', 'logo-v2', 'boat', 'boat-new', 'skier', 'pole', 'fish1', 'fish2', 'sea', 'bgr', 'coin', 'title-bgr', 'zone-screen', 'end-screen' ]);
        this.load.spritesheet('waves', 'waves-2.png', 16, 6);

    },

    create: function () {

        this.state.start('Aquaplane.MainMenu');

    }

};



Aquaplane.Interstitial = function () {};

Aquaplane.Interstitial.prototype = {

    create: function () {

        console.log(zone);
        if (zone>=4){
            this.state.start('Aquaplane.Finish');
        }

        zone++;

        percent = 0;

        var logo = this.add.image(this.world.centerX, 200, 'zone-screen');
        logo.anchor.x = 0.5;

        var start = this.add.bitmapText(this.world.centerX, 460, 'fat-and-tiny', zones[zone-1], 64);
        start.anchor.x = 0.5;
        start.smoothed = false;
        start.tint = 0xff0000;

        this.input.onDown.addOnce(this.start, this);

    },

    start: function () {

        this.state.start('Aquaplane.Game');

    }

};


Aquaplane.Finish = function () {};

Aquaplane.Finish.prototype = {

    create: function () {
        this.add.image(0, 0, 'title-bgr');

        var logo = this.add.image(this.world.centerX, 200, 'end-screen');
        logo.anchor.x = 0.5;

        var start = this.add.bitmapText(this.world.centerX, 460, 'fat-and-tiny', 'Coins: ' + coins, 64);
        start.anchor.x = 0.5;
        start.smoothed = false;
        start.tint = 0xff0000;

    },

    start: function () {
    }

};


Aquaplane.Game = function (game) {

    this.score = 0;
    this.scoreText = null;

    this.lives = 3;
    this.livesText = null;

    this.speed = 420;
    this.lastKey = 0;
    this.ready = false;

    this.layer = null;
    this.itemDist = ['lighthouse', 'lighthouse', 'lighthouse', 'coin', 'coin', 'fish1', 'fish1'];

    this.boat = null;
    this.skier = null;
    this.rope = null;

    this.timer = null;
    this.barTimer = null;

    this.itemInterval = { count: 0, min: 900, max: 900 };

    this.pauseKey = null;
    this.debugKey = null;

    this.showDebug = false;



};

Aquaplane.Game.prototype = {

    init: function () {

        this.score = 0;
        this.lives = lives;
        this.speed = 400;

        this.ready = false;
        this.lastKey = 0;

        this.timer = this.time.create(false);
        this.barTimer = this.time.create(false);
        this.itemInterval = { count: 0, min: 900, max: 1500 };

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 0;

        this.showDebug = false;

    },

    create: function () {

        this.add.image(0, 0, 'bgr');

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
        this.boat.scale.set(0.2);
        this.physics.p2.enable(this.boat, false);
        this.boat.body.mass = 1;
        this.boat.body.damping = 0.5;
        this.boat.body.fixedRotation = true;
        this.boat.body.collideWorldBounds = false;
        this.boatBounds = new Phaser.Rectangle(0, 0, 60, 10);

        //skier
        this.skier = this.layer.create(0, 0, 'skier');
        this.physics.p2.enable(this.skier, false);
        this.skier.body.mass = 0.05;
        this.skier.body.damping = 0.5;
        this.skier.body.fixedRotation = true;
        this.skier.body.collideWorldBounds = false;
        this.skierBounds = new Phaser.Rectangle(0, 0, 30, 8);

        var rev = new p2.RevoluteConstraint(this.boat.body.data, this.skier.body.data, {
                localPivotA: [9, 0],
                localPivotB: [2, 0],
                collideConnected: false
            });
        this.physics.p2.world.addConstraint(rev);
        rev.setLimits(this.math.degToRad(-40), this.math.degToRad(40));
        rev.setStiffness(2.0);


        //make boat draggable
        this.boat.inputEnabled = true;
        this.boat.input.enableDrag(true);
        this.boat.events.onDragStart.add(function(){
            console.log('drag');
        }, this);

        this.layer.onChildInputDown.add(function(sprite, pointer){
            console.log('blah');
        }, this);



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
        //this.scoreText = this.add.bitmapText(16, 0, 'fat-and-tiny', 'SCORE: 0', 32);
        //this.scoreText.smoothed = false;

        this.coinText = this.add.bitmapText(16, 0, 'fat-and-tiny', 'COINS: 0', 32);
        this.coinText.smoothed = false;

        this.zoneText = this.add.bitmapText(game.width/2, 0, 'fat-and-tiny', zones[zone-1], 32);
        this.zoneText.anchor.x = 0.5;
        this.zoneText.smoothed = false;

        this.livesText = this.add.bitmapText(game.width, 0, 'fat-and-tiny', 'LIVES: ' + this.lives, 32);
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
        this.music.stop();
        this.music.loop = true;
        this.music.play();
        this.coin = game.add.audio('coin');



        //Progress bar
        var barConfig = {
            x: game.width / 2,
            y: game.height - 20,
            width: game.width,
            bg: {
                color: '#ffffff'
            },
            bar: {
                color: '#ec0e09'
            }
        };
        percent = 0;
        myHealthBar = new HealthBar(this.game, barConfig);
        // the width will be set to 50% of the actual size so the new value will be 60
        myHealthBar.setPercent(percent);

        console.log(700-(zone*50))

        this.barTimer.loop(700-(zone*50), function(){
            percent = percent + 1;
            myHealthBar.setPercent(percent);
        }, this);
        this.barTimer.start();


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

        this.timer.add(this.itemInterval.max, this.releaseItem, this);
        this.timer.start();

    },

    releaseItem: function (x, y) {

        if (x === undefined) { x = this.game.width; }
        if (y === undefined) { y = this.rnd.between(80, this.game.height); }

        var frame = this.rnd.pick(this.itemDist);

        var item = this.layer.getFirstDead(true, x, y, frame);
        
        this.physics.arcade.enable(item);

        if (frame === 'fish1' || frame === 'fish2')
        {
            item.scale.setTo(0.4);
        }
        else if(frame === 'coin'){
            item.scale.setTo(0.2);
        }
        else if(frame === 'lighthouse'){
            item.scale.setTo(0.3);
        }
        else
        {
            item.scale.setTo(1);
            //item.body.setSize(16, 8, 0, 24);
        }

        var i = this.math.snapToFloor(y, 65) / 65;

        item.body.velocity.x = -120 + (i * -30);

        this.itemInterval.count++;

        //  Every 10 new items we'll speed things up a bit
        if (this.itemInterval.min > 100 && this.itemInterval.count % 10 === 0)
        {
            this.itemInterval.min -= 10;
            this.itemInterval.max -= 10;
        }

        //  Is the player idle? Then release another item directly towards them
        if ((this.time.time - this.lastKey) > 200)
        {
            this.lastKey = this.time.time;
            this.releaseItem(this.game.width, this.skier.y - 16);
        }
        else
        {
            this.timer.add(this.rnd.between(this.itemInterval.min, this.itemInterval.max), this.releaseItem, this);
        }

    },

    update: function () {

        this.layer.sort('y', Phaser.Group.SORT_ASCENDING);


        //this.boat.events.onInputDown.add(function(sprite, pointer){
        //    this.boat.x = pointer.x;
        //    this.boat.y = pointer.y;
        //}, this);

        if (this.ready)
        {
            this.updateBoat();

            //  Score based on their position on the screen
            //this.score += (this.math.snapToFloor(this.skier.y, 65) / 65);
            //this.scoreText.text = "SCORE: " + this.score;
            this.coinText.text = "COINS: " + coins;
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
        this.skierBounds.centerOn(this.skier.x + 2, this.skier.y + 10);

        this.emitter.emitX = this.boat.x - (this.boat.width/2);
        this.emitter.emitY = this.boat.y + 10;

        //  Let's sort and collide
        this.layer.forEachAlive(this.checkItem, this);

        if (percent >= 100) {
            game.state.start('Aquaplane.Interstitial');
        }

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

    },
    accelerateToObject: function (obj1, obj2) {
        speed = 30;
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
        obj1.body.force.y = Math.sin(angle) * speed;
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

                if(item.key === 'coin' || item.key === 'fish1'){
                    item.destroy();
                    this.coin.play();
                    coins++;
                }else {
                    this.loseLife();
                }
            }
        }

    },

    loseLife: function () {

        if (this.lives === 0)
        {
            this.gameOver();
        }
        else
        {
            this.lives--;
            lives--;

            this.livesText.text = "LIVES: " + this.lives;

            this.ready = false;

            //  Kill the surfer!
            this.skier.visible = false;

            //  Hide the rope
            this.rope.clear();

            //  Speed the boat away
            this.boat.body.setZeroVelocity();
            this.boat.body.velocity.x = 600;

            this.itemInterval.min += 200;
            this.itemInterval.max += 200;
        }

    },

    gameOver: function () {

        this.state.start('Aquaplane.MainMenu');

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


