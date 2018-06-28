

var dist = 175;
var selectedAct = "";


var acts = [
    {name:'Orbital',frame:0,tune:"halcyon", key:'orbital'},
    {name:'Little Dragon',frame:1,tune:"ritual", key:'little-dragon'},
    {name:'The Jacksons',frame:2,tune:"abc", key:'jacksons'},
    {name:'Kamasi Washington',frame:3,tune:"truth", key:'kamasi'}
]
    
    


var PlayerSelection = {

    preload: function () {
        

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

        

    },

    create: function () {

        loadingText.destroy();

        var sea = game.add.sprite(0, game.height, 'sea');
        sea.anchor.set(0, 1);

        var ribbon = this.add.bitmapText(game.world.centerX, 0, 'blanch', 'Select YO CREW', 64);
        ribbon.anchor.set(0.5, 0);
        
        //array of all available themes
        var themes = [];
        
        acts.forEach(function(act, idx){
            themes.push(game.add.sprite(0, 0, 'logos', idx));
        });

        //artist name text

        var name = this.add.bitmapText(game.world.centerX, game.height-settings.nameOffset, 'blanch', acts[0].name, 50);
        name.anchor.set(0.5, 1);

        //number of themes
        var totalThemes = themes.length;

        //the selected theme
        var prime = 0;

        //speed of moving animation
        var animationSpeed = 200;

        //initial setup; all items on the right side; anchor set to mid;
        themes.forEach(function (item) {
            item.anchor.setTo(0.5);
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
                themes[prime + 1].x = game.width / 2 + 67 + dist;
                themes[prime + 1].scale.setTo(0.5, 0.5);
            }

            //check if there is another theme available to display on the left side; if yes then position it
            if (prime > 0) {
                themes[prime - 1].x = game.width / 2 - 67 - dist;
                themes[prime - 1].scale.setTo(0.5, 0.5);
            }
        }

        //set initial state
        setToPosition(prime);

        //predefined x positions for the 3 visible cards
        var xleft = game.width / 2 - 67 - dist;
        var xprime = game.width / 2;
        var xright = game.width / 2 + 67 + dist;

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
            var clickedPos = themes.indexOf(el);
            name.setText(acts[themes.indexOf(el)].name);
            if (clickedPos > prime) {
                //move to left
                nextTheme();
            } else if (clickedPos < prime) {
                //move to right
                previousTheme();
            }
            else{
                selectedAct = acts[themes.indexOf(el)];
                
                gtag('event', 'selection', {
                    'event_category' : 'Band',
                    'event_label' : selectedAct.name
                  });
                game.state.start('Preloader');
            }
        }


        gtag('event', 'Player Selection Stage');

    },

    update: function () {


    }


};