

var w = Math.max (document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

if (w > 800){
    //Switch to desktop settings
    //settings = desktopSettings;
}

//max width height

//800 x 450






var game = new Phaser.Game(w, h, Phaser.AUTO, 'game');

game.state.add('Aquaplane.Preloader', Aquaplane.Preloader);
game.state.add('Aquaplane.MainMenu', Aquaplane.MainMenu);
game.state.add('Aquaplane.PlayerSelection', Aquaplane.PlayerSelection);
game.state.add('Aquaplane.Interstitial', Aquaplane.Interstitial);
game.state.add('Aquaplane.Finish', Aquaplane.Finish);
game.state.add('Aquaplane.Game', Aquaplane.Game);
game.state.start('Aquaplane.Preloader');