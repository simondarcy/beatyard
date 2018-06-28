var splash = document.getElementById('splash');
var btn = document.getElementById('btn');
var isMobile=( navigator.userAgent.indexOf("Mobile") !=-1);

function bootstrap(){
    splash.style.display="none";
    var w = Math.max (document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (w > 940){
        w=940;
        h=529;
        //Switch to desktop settings
        settings = desktopSettings;
    }
    //Set up game
    game = new Phaser.Game(w, h, Phaser.AUTO, 'game');
    
    //add various game states
    game.state.add('PlayerSelection', PlayerSelection);
    game.state.add('Preloader', Preloader);
    game.state.add('Instructions', Instructions);
    game.state.add('GameOver', GameOver);
    game.state.add('Aquaplane.Game', Aquaplane.Game);
    game.state.start('Instructions');
}

//Force the user onto landscape 
var flipped = false;
function OrientationChanged()
{
    //switch statement to select a behaviour based on the screens orientation
    switch (window.orientation) {
        case 0:
        case 180:
            //Portrait mode: show the illustration
            if (!flipped) {
                document.getElementById("flip").style.display = "block";
            }
            break;
        case 90:
        case -90:
            //Lanscape mode: hide the illustration
            document.getElementById("flip").style.display = "none";
            //prevent re init should user flip multiple times
            if (!flipped) {
                setTimeout(function(){
                    window.scrollTo(0, 1);
                }, 0);
                splash.style.display = 'table';
                flipped = true;
            }
            break;
        case undefined:
            console.log('none');
    }
}


window.onload = function(){
          
    //If a mobile device
    if (isMobile) {
        //initially check orientation
        OrientationChanged();
        //detect orientation change
        window.addEventListener('orientationchange', OrientationChanged);
    }
    else{ //Desktop
        splash.style.display = 'table';
    }
    
    //Enable start btn click/tap
    splash.addEventListener("click", function(){
     bootstrap();
    });

    gtag('event', 'Game Loaded');
    
};



