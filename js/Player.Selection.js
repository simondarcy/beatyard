Aquaplane.PlayerSelection = function () {};

var players = {
    'Tito':{
        'image':'tito.png'
    },
    'Germaine':{
        image:'germaine.png'
    },
    'Jackie':{
        image:'jackie.png'
    },
    'Marlon':{
        image:'marlon.png'
    }
};

Aquaplane.PlayerSelection.prototype = {


    preload: function () {


        game.load.spritesheet('waves', 'waves-2.png', 16, 6);
        game.load.image('theme1', 'tito.png');
        game.load.image('theme2', 'marlon.png');
        game.load.image('theme3', 'jackie.png');
        game.load.image('theme4', 'germaine.png');
    },

    create: function () {



        /* waves */
        //  Let's create some waves (harmless eye candy)
        //
        //  Divide screen vertically into 520px / 8 layers = 65px per layer
        //  Place 8 waves per layer (8*8 total)

        noOfLayers = 10;

        var area = new Phaser.Rectangle(0, 0, this.game.width, this.game.height);
        this.layer = this.add.group();
        this.layer.inputEnableChildren = true;
        for (var i = 1; i <= noOfLayers; i++)
        {
            for (var w = 0; w < noOfLayers; w++)
            {
                var wave = this.layer.create(area.randomX, area.randomY, 'waves', this.rnd.between(0, 2));
                wave.anchor.y = -1.5;
                this.physics.arcade.enable(wave);
                wave.body.velocity.x = -120 + (i * -30);
            }

            area.y += 65;
        }



        //array of all available themes
        var themes = [];
        themes.push(game.add.sprite(0, 0, 'theme1'));
        themes.push(game.add.sprite(0, 0, 'theme2'));
        themes.push(game.add.sprite(0, 0, 'theme3'));
        themes.push(game.add.sprite(0, 0, 'theme4'));

        //number of themes
        var totalThemes = themes.length;


        //the selected theme
        var prime = 0;

        //speed of moving animation
        var animationSpeed = 200;

        //initial setup; all items on the right side; anchor set to mid;
        themes.forEach(function (item) {
            item.anchor.setTo(0.5, 0.5);
            item.x = game.width + 150;
            item.y = game.height / 2;
            item.inputEnabled = true;

            item.events.onInputDown.add(clickListener, this);
        });


        //initial position of themes on stage based on the selected theme
        function setToPosition(prime) {
            themes[prime].x = game.width / 2;

            //check if there is another theme available to display on the right side; if yes then position it
            if (prime < (totalThemes - 1)) {
                themes[prime + 1].x = game.width / 2 + 67 + 75;
                themes[prime + 1].scale.setTo(0.5, 0.5);
            }

            //check if there is another theme available to display on the left side; if yes then position it
            if (prime > 0) {
                themes[prime - 1].x = game.width / 2 - 67 - 75;
                themes[prime - 1].scale.setTo(0.5, 0.5);
            }
        }

        //set initial state
        setToPosition(prime);

        //predefined x positions for the 3 visible cards
        var xleft = game.width / 2 - 67 - 75;
        var xprime = game.width / 2;
        var xright = game.width / 2 + 67 + 75;

        //move to next theme
        function nextTheme() {
            //move prime left
            game.add.tween(themes[prime]).to({x: xleft}, animationSpeed, null, true);
            game.add.tween(themes[prime].scale).to({x: 0.5, y: 0.5}, animationSpeed, null, true);
            //move right to prime
            if (prime < 3) {
                game.add.tween(themes[prime + 1]).to({x: xprime}, animationSpeed, null, true);
                game.add.tween(themes[prime + 1].scale).to({x: 1, y: 1}, animationSpeed, null, true);
            }
            //move new to right
            if (prime < 2) {
                themes[prime + 2].x = game.width + 150;
                themes[prime + 2].scale.setTo(0.5, 0.5);
                game.add.tween(themes[prime + 2]).to({x: xright}, animationSpeed, null, true);
            }
            //move left out
            if (prime > 0) {
                //themes[prime+1].x = -150;
                themes[prime - 1].scale.setTo(0.5, 0.5);
                game.add.tween(themes[prime - 1]).to({x: -150}, animationSpeed, null, true);
            }
            prime++;

        }

        //move to previous theme
        function previousTheme() {
            //move prime left
            game.add.tween(themes[prime]).to({x: xright}, animationSpeed, null, true);
            game.add.tween(themes[prime].scale).to({x: 0.5, y: 0.5}, animationSpeed, null, true);
            //move left to prime
            if (prime > 0) {
                game.add.tween(themes[prime - 1]).to({x: xprime}, animationSpeed, null, true);
                game.add.tween(themes[prime - 1].scale).to({x: 1, y: 1}, animationSpeed, null, true);
            }
            //move new to left
            if (prime > 1) {
                themes[prime - 2].x = -150;
                themes[prime - 2].scale.setTo(0.5, 0.5);
                game.add.tween(themes[prime - 2]).to({x: xleft}, animationSpeed, null, true);
            }
            //move right out
            if (prime < (totalThemes - 1)) {
                //themes[prime+1].x = -150;
                themes[prime + 1].scale.setTo(0.5, 0.5);
                game.add.tween(themes[prime + 1]).to({x: game.width + 150}, animationSpeed, null, true);
            }
            prime--;
        }

        //click on theme listener
        function clickListener(el) {
            console.log(themes.indexOf(el));
            var clickedPos = themes.indexOf(el);
            if (clickedPos > prime) {
                //move to left
                nextTheme();
            } else if (clickedPos < prime) {
                //move to right
                previousTheme();
            }
            else{
                game.state.start('Aquaplane.Interstitial');
            }
        }

    },

    update: function () {

        this.layer.forEachAlive(function(item){
            if (item.x < -32) item.x = this.rnd.between(this.game.width, this.game.height);
        }, this);

    }


};