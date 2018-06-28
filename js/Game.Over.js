var timer;
var counter = 0;
var discount;

var GameOver = {

    preload: function () {

        game.stage.backgroundColor = "#cef8fe";

    },

    create: function () {
        counter = 0;
        //default discount
        discount = 10;
        var discountLink = "https://beatyard.eventbrite.ie?discount=game10";

        //get discount
        if(score>=settings.threshold){
            discount = 20;
            discountLink = "https://beatyard.eventbrite.ie?discount=game20";
        }

        var sea = game.add.sprite(0, game.height, 'sea');
        sea.anchor.set(0, 1);
        //sea.scale.set(0.7);

        var band = game.add.sprite(game.world.centerX, game.world.centerY-25, 'band');
        band.anchor.set(0.5);
        band.scale.set(settings.endBandScale);

        var logo = game.add.sprite(settings.endLogoOffset, settings.endLogoOffset, 'end-logo');
        //logo.anchor.set(0, 1);
        logo.scale.set(settings.endLogoScale);

        var ribbon = this.add.bitmapText(game.world.centerX, 0, 'blanch', 'Claim your discount', 64);
        ribbon.anchor.set(0.5, 0);
        ribbon.tint = 0xff0000;

        var dx = game.add.sprite(game.width, game.height, 'discount-bgr');
        dx.anchor.set(1);
        dx.scale.set(settings.endDiscountScale);

        var discountTxt = this.add.bitmapText(dx.centerX, dx.centerY, 'blanch', '0%', settings.endDiscountTXT);
        discountTxt.anchor.set(0.5);
        discountTxt.tint = 0xFF0000;

        //End score
        var scoreBgr = game.add.sprite(0+settings.logoOffset, game.height-settings.logoOffset, 'score-bgr');
        scoreBgr.scale.set(settings.endScoreScale);
        scoreBgr.anchor.set(0,1);

        var scoreTxt = this.add.bitmapText(scoreBgr.centerX, scoreBgr.centerY, 'blanch', 'score: '+score, settings.endScoreTXT);
        scoreTxt.angle=-25;
        scoreTxt.anchor.set(0.5);
        scoreTxt.tint = 0xFF0000;

        //Claim Discount Button
        var discountButton = game.add.sprite(game.world.centerX-15, game.height-settings.endBtnOffset, 'claim');
        discountButton.anchor.set(1, 0);
        discountButton.inputEnabled = true;
        discountButton.events.onInputOver.add(function(){
            discountButton.frame = 1;
        }, this);
        discountButton.events.onInputOut.add(function(){
            discountButton.frame = 0;
        }, this);
        discountButton.events.onInputDown.add(function(){
            gtag('event', 'Discount Claimed');

            gtag('event', 'button pressed', {
                'event_category' : 'Discount Claimed',
                'event_label' : discount
              });

            if(settings.isMobile){
                document.body.classList.add('fade');
                window.location.href = discountLink;
            }
            else{
                window.open(discountLink, "_blank");
            }
        }, this);

        //Play again Button

        var playButton = game.add.sprite(game.world.centerX+15, game.height-settings.endBtnOffset, 'play-again');
        playButton.anchor.set(0, 0);
        playButton.inputEnabled = true;
        playButton.events.onInputOver.add(function(){
            playButton.frame = 1;
        }, this);
        playButton.events.onInputOut.add(function(){
            playButton.frame = 0;
        }, this);
        playButton.events.onInputDown.add(function(){
            gtag('event', 'Replay');
            game.state.start('Aquaplane.Game');
        }, this);

        timer = game.time.create(false);

        //  Set a TimerEvent to occur after 2 seconds
        timer.loop(100, function(){

            if(counter<discount){
                counter++;
                discountTxt.setText(counter+'%');
            }
            else{
                timer.stop();
                tweenA = game.add.tween(discountTxt.scale).to( { x: 1.5, y: 1.5}, 500, "Quart.easeOut");
                tweenB = game.add.tween(discountTxt.scale).to( { x: 1, y: 1}, 1000, "Quart.easeOut");
                tweenA.chain(tweenB);
                tweenA.start();
            }

        }, this);

        timer.start();


                //Share Buttongs
                var shareIcons = game.add.group();

                shareIconsX =  game.width - settings.shareOffset;
                shareIconsY  = 100;

                var facebook = game.add.button(shareIconsX, shareIconsY - settings.shareSpacing, 'facebook');
                facebook.anchor.setTo(0.5);
                facebook.scale.set(settings.shareScale);

                var twitter = game.add.button(shareIconsX, shareIconsY, 'twitter');
                twitter.anchor.setTo(0.5);
                twitter.scale.set(settings.shareScale);
                var link;
                if(settings.isMobile) {
                    link = game.add.button(shareIconsX, shareIconsY + settings.shareSpacing, 'whatsapp');

                }
                else{
                    link = game.add.button(shareIconsX, shareIconsY + settings.shareSpacing, 'link');
                }
                link.anchor.setTo(0.5);
                link.scale.set(settings.shareScale);

                facebook.onInputUp.add(function(){
                    url = "//www.facebook.com/sharer/sharer.php?u="+shareURL;
                    window.open(url, "_blank")
                }, this);
                twitter.onInputUp.add(function(){
                    shareText = "Play Beatyard Boogie and earn up to 20%25 off Beatyard tickets";
                    url = "//twitter.com/share?url="+shareURL+"&text="+shareText+"&via=BeatYard&hashtags=nauticalboogie,beatyard,bodytonicmusic";
                    window.open(url, "_blank")
                }, this);

                link.onInputUp.add(function(){
                    shareText = "Play Beatyard Boogie and earn up to 20% off Beatyard festival tickets. Play here: "+shareURL;

                    //If mobile open in whatsapp
                    if(settings.isMobile){
                        url = "whatsapp://send?text=" + shareText;
                        window.open(url, "_blank")
                    }
                    else{
                        //If desktop, copy link to clipboard
                        var $temp = document.createElement("input");
                        document.body.appendChild($temp);
                        $temp.value = shareText;
                        $temp.focus();
                        $temp.select();
                        document.execCommand("copy");
                        document.body.removeChild($temp);
                        alert("Game link copied to clipboard. Thanks for sharing!");
                    }

                }, this);

                shareIcons.add(facebook);
                shareIcons.add(twitter);
                shareIcons.add(facebook);

                //make sure logo is above
                game.world.bringToTop(shareIcons);

                gtag('event', 'Game Over Stage');
                gtag('event', 'stat', {
                    'event_category' : 'Score',
                    'event_label' : score
                  });

                gtag('event', 'stat', {
                'event_category' : 'Discount',
                'event_label' : discount
                });


    },

    update: function () {

    }
};
