Aquaplane.MainMenu = function () {};

Aquaplane.MainMenu.prototype = {

    create: function () {


        game.stage.backgroundColor = '#40a2da';

        coins = 0;
        zone = 0;

        

        var logo = this.add.image(this.world.centerX, this.world.centerY, 'logo-v2');
        logo.anchor.set(0.5);

        var start = this.add.bitmapText(this.world.centerX, 460, 'fat-and-tiny', 'CLICK TO PLAY', 64);
        start.anchor.x = 0.5;
        start.smoothed = false;
        start.tint = 0xff0000;

        this.input.onDown.addOnce(this.start, this);

    },

    start: function () {

        this.state.start('Aquaplane.PlayerSelection');

    }

};