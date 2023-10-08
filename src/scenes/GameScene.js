import * as Config from '../config/constants';

class GameScene extends Phaser.Scene {
    constructor(config) {
        super({
            key: 'GameSceneKey'
        });

        this.gameHeight = Config.GAME_HEIGHT;
        this.gameWidth = Config.GAME_WIDTH;
        this.playerMaxSpeed = Config.PLAYER_MAX_SPEED;
        this.playerTurnSpeed = Config.PLAYER_TURN_SPEED;
        this.debug = Config.DEBUG_MODE;
        
        this.player;
        this.playerProgress = {};
        this.speedText;
        this.realTimeText;
        this.distanceText;
        this.playAgainText;
        this.winText;
        this.distance;
        this.distaceX;
        this.distanceY;
        this.currentSpeed;
        this.realTime;
        this.particles;
        this.totalFuel;
        this.fuelUsed;
        this.collide;
        this.gameOverStatus = false;
        this.gameOver;
        this.updatePosition;
        this.checkPoint;
        this.checkPointText;
        this.arrowImage;
        this.checkPointArray = [];
        this.gameOver;
        this.outOfFuel;
    }

    //PRELOAD===================================================================================
    preload() {
        this.load.image('background', './assets/images/nebula.jpg');
        this.load.image('player', './assets/images/ship_r.png');
        this.load.image('blue', './assets/images/blue.png');
        this.load.image('fire', './assets/images/fire.png');
        this.load.image('arrow', './assets/images/arrow.png');
        this.load.atlas('space', './assets/images/space.png', './assets/images/space.json');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.realTime = 0;
        this.checkPointArray = [];
        this.distance = 0;
        this.totalFuel = 100
        this.orange = 0xff5733
        this.green = 0x2eec71
        this.red = 0xff0000
        this.gameOverStatus = false;
    }

    //CREATE===================================================================================
    create() {

        //player--------------------------------------------
        this.player = this.physics.add.sprite(this.gameWidth * .1, this.gameHeight * .5, 'player').setDepth(2);
        this.player.setDrag(400)
        this.player.setAngularDrag(400)
        this.player.setMaxVelocity(this.playerMaxSpeed)
        this.player.setScale(.7)
        this.playerProgress = {
            checkPointIndex: 0,
            checkPassed: false
        };

        this.input.addPointer(2)

        //background----------------------------------------
        this.background = this.add.tileSprite(400, 300, 800, 600, 'background').setScrollFactor(0)

        //add planets----------------------------------------------
        this.add.image(512, 680, 'space', 'blue-planet').setOrigin(0).setScrollFactor(0.6);
        this.add.image(2833, 1246, 'space', 'brown-planet').setOrigin(0).setScrollFactor(0.6);
        this.add.image(3875, 531, 'space', 'sun').setOrigin(0).setScrollFactor(0.6);
        this.add.image(908, 3922, 'space', 'gas-giant').setOrigin(0).setScrollFactor(0.6);
        this.add.image(3140, 2974, 'space', 'brown-planet').setOrigin(0).setScrollFactor(0.6).setScale(0.8).setTint(0x882d2d);
        this.add.image(6052, 4280, 'space', 'purple-planet').setOrigin(0).setScrollFactor(0.6);
        const galaxy = this.add.image(6369, 1351, 'space', 'galaxy').setBlendMode(1).setScrollFactor(0.6);
        //rotate galaxy
        this.tweens.add({
            targets: galaxy,
            angle: 360,
            duration: 100000,
            ease: 'Linear',
            loop: -1
        });
        this.distanceX = this.gameWidth * .02;
        this.distanceY = this.gameHeight * 0.025;
        //text----------------------------------------------
        this.distanceText = this.add.bitmapText(this.distanceX, this.distanceY, 'carrier_command', '').setTint(this.red).setScale(.5).setScrollFactor(0).setDepth(2)
        this.realTimeText = this.add.bitmapText(this.distanceX, this.distanceY + 30, 'carrier_command', '').setTint(this.red).setScale(.5).setScrollFactor(0).setDepth(2)
        this.speedText = this.add.bitmapText(this.distanceX, this.distanceY + 60, 'carrier_command', '').setTint(this.red).setScale(.5).setScrollFactor(0).setDepth(2)
        this.fuelText = this.add.bitmapText(this.distanceX, this.distanceY + 90, 'carrier_command', '').setTint(this.red).setScale(.5).setScrollFactor(0).setDepth(2)
        this.checkPointText = this.add.bitmapText(this.distanceX, this.distanceY + 120, 'carrier_command', '').setTint(this.red).setScale(.5).setScrollFactor(0).setDepth(2)

        //function to create particles
        function createShipEmitter(scene, ship, sprite, direction, scale) {
            const emitter = scene.add.particles(0, 0, sprite, {
                speed: 100,
                lifespan: {
                    onEmit: (particle, key, t, value) => {
                        return Phaser.Math.Percent(100, 0, 50) * 1000;
                    }
                },
                alpha: {
                    onEmit: (particle, key, t, value) => {
                        return Phaser.Math.Percent(100, 0, 500) * 50;
                    }
                },
                angle: {
                    onEmit: (particle, key, t, value) => {
                        return Phaser.Math.Between(-10, 10) + direction
                    }
                },
                scale: {
                    start: scale,
                    end: 0
                },
                blendMode: 'ADD'
            });

            // Position the emitter relative to the ship
            emitter.startFollow(ship);

            return emitter;
        }

        //checkpoints---------------------------------------
        this.checkPoint1 = this.physics.add.sprite(512 * 2, 680 * 2, 'player').setScale(.7).setDepth(1);
        this.checkPoint2 = this.physics.add.sprite(2833 * 2, 1246 * 2, 'player').setScale(.7).setDepth(1);
        this.checkPoint3 = this.physics.add.sprite(3875 * 2, 531 * 2, 'player').setScale(.7).setDepth(1);
        this.checkPoint4 = this.physics.add.sprite(6369 * 2, 1351 * 2, 'player').setScale(.7).setDepth(1);
        this.checkPoint5 = this.physics.add.sprite(3140 * 2, 2974 * 2, 'player').setScale(.7).setDepth(1);
        this.checkPoint6 = this.physics.add.sprite(908 * 2, 3922 * 2, 'player').setScale(.7).setDepth(1);
        this.checkPoint7 = this.physics.add.sprite(5800 * 2, 4000 * 2, 'player').setScale(.7).setDepth(1);
        this.checkPointArray.push(this.checkPoint1, this.checkPoint2, this.checkPoint3, this.checkPoint4, this.checkPoint5, this.checkPoint6, this.checkPoint7)

        //create particles for each ship
        const playerEmitter = createShipEmitter(this, this.player, 'blue', 180, .6);
        const emitter1 = createShipEmitter(this, this.checkPoint1, 'fire', 270, .2);
        const emitter2 = createShipEmitter(this, this.checkPoint2, 'fire', 270, .2);
        const emitter3 = createShipEmitter(this, this.checkPoint3, 'fire', 270, .2);
        const emitter4 = createShipEmitter(this, this.checkPoint4, 'fire', 270, .2);
        const emitter5 = createShipEmitter(this, this.checkPoint5, 'fire', 270, .2);
        const emitter6 = createShipEmitter(this, this.checkPoint6, 'fire', 270, .2);
        const emitter7 = createShipEmitter(this, this.checkPoint7, 'fire', 270, .2);

        //create arrow
        this.arrow = this.add.image(this.gameWidth * .9, this.gameHeight * .1, 'arrow').setScrollFactor(0)
        //win---------------------------------------------------
        this.gameOver = () => {
            this.gameOverStatus = true;
            this.winText = this.add.bitmapText(this.gameWidth * .5, this.gameHeight * .4, 'carrier_command', `All Ships Rescued!`).setTint(0xff0000).setOrigin(.5).setScrollFactor(0);
            this.distanceGMText = this.add.bitmapText(this.gameWidth * .5, this.gameHeight * .6, 'carrier_command', `distance: ${this.distance.toFixed(2)}`).setTint(0xff0000).setOrigin(.5).setScrollFactor(0).setScale(.5);
            this.timeGMText = this.add.bitmapText(this.gameWidth * .5, this.gameHeight * .7, 'carrier_command', `time: ${this.realTime.toFixed(2)}`).setTint(0xff0000).setOrigin(.5).setScrollFactor(0).setScale(.5);
            this.playAgainText = this.add.bitmapText(this.gameWidth * .5, this.gameHeight * .8, 'carrier_command', `Press Enter to play again`).setTint(0xff0000).setOrigin(.5).setScrollFactor(0).setScale(.5);
            this.player.disableBody(true, false)
            this.tweens.add({
                targets: [this.winText],
                x: 10,
                duration: 1000,
                repeat: -1,
                repeatDelay: 1000,
                ease: 'back.in',
            })
        }

        this.outOfFuel = () => {
            this.gameOverStatus = true
            this.gameOverText = this.add.bitmapText(this.gameWidth * .5, this.gameHeight * .4, 'carrier_command', `out of fuel!`).setTint(0xff0000).setOrigin(.5).setScrollFactor(0);
            this.gameOverText = this.add.bitmapText(this.gameWidth * .5, this.gameHeight * .6, 'carrier_command', `game over`).setTint(0xff0000).setOrigin(.5).setScrollFactor(0);
            this.playAgainText = this.add.bitmapText(this.gameWidth * .5, this.gameHeight * .8, 'carrier_command', `Press Enter to play again`).setTint(0xff0000).setOrigin(.5).setScrollFactor(0).setScale(.5);
            this.player.disableBody(true, false)
        }
    // Create two touch zone rectangles
    const leftZone = new Phaser.Geom.Rectangle(0, 0, this.gameWidth / 2, this.gameHeight);
    const rightZone = new Phaser.Geom.Rectangle(this.gameWidth/2, 0, this.gameWidth/2, this.gameHeight);

    // Graphics objects to visualize the touch zones (optional)
    const graphics = this.add.graphics({ fillStyle: { color: 0xff0000, alpha: 0} });
    graphics.fillRectShape(leftZone).setScrollFactor(0);
    graphics.fillStyle(0xff0000, 0);
    graphics.fillRectShape(rightZone).setScrollFactor(0);

    // Set up touch input handling
    this.input.on('pointerdown', (pointer) => {
        if (Phaser.Geom.Rectangle.Contains(leftZone, pointer.x, pointer.y)) {
            this.player.setAngularVelocity(-this.playerTurnSpeed)
        } else if (Phaser.Geom.Rectangle.Contains(rightZone, pointer.x, pointer.y)) {
            this.player.setAngularVelocity(this.playerTurnSpeed)
        }
    });
        
    }
    
    //UPDATE===================================================================================
    update(time, delta) {
        
        //player movement-----------------------------------------
        const {
            left,
            right,
            up,
            space
        } = this.cursors;

      
        //LEFT
        if (left.isDown) {
            this.player.setAngularVelocity(-this.playerTurnSpeed)
        }
        //RIGHT
        else if (right.isDown) {
            this.player.setAngularVelocity(this.playerTurnSpeed)
        } else {
            this.physics.velocityFromRotation(this.player.rotation, 600, this.player.body.acceleration)
        };

        //camera-------------------------------------------------
        this.cameras.main.startFollow(this.player);
        this.cameras.width = 1000
        this.cameras.height = 1000

        //move background as player moves - delta calculates the change in x/time
        this.background.tilePositionX += this.player.body.deltaX() * 0.5;
        this.background.tilePositionY += this.player.body.deltaY() * 0.5;

        //calculate things
        this.realTime += 1 / 60
        this.fuelUsed = this.totalFuel - (this.distance)/1000;
        this.currentSpeed = this.player.body.velocity.length();
        this.distance += Math.sqrt(this.player.body.deltaX() * this.player.body.deltaX() + this.player.body.deltaY() * this.player.body.deltaY());
        

        if(!this.gameOverStatus){

             //stats
            this.distanceText.setText(`distance: ${Math.round(this.distance)}mi`)
            this.realTimeText.setText(`time: ${(this.realTime).toFixed(2)}`)
            this.speedText.setText(`speed: ${this.currentSpeed.toFixed(2)}`)
            this.fuelText.setText(`fuel: ${this.fuelUsed.toFixed(2)}`)
            this.checkPointText.setText(`ships rescued: ${this.playerProgress.checkPointIndex}/${this.checkPointArray.length}`)
       
            //arrow rotation
            let playerCurrentCheckPoint = this.checkPointArray[this.playerProgress.checkPointIndex]
            this.arrow.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, playerCurrentCheckPoint.x, playerCurrentCheckPoint.y);
        
            //track rescues
            let playerisOverlapping = this.physics.overlap(this.player, playerCurrentCheckPoint);

            if (playerisOverlapping && !this.player.checkPassed) {
                playerCurrentCheckPoint.disableBody(true, true)
                if(this.playerProgress.checkPointIndex <= this.checkPointArray.length){
                    this.playerProgress.checkPointIndex += 1
                }
                
                this.playerProgress.checkPassed = true;    
            }

            //if all ships rescued
            if (this.playerProgress.checkPointIndex == this.checkPointArray.length) {
                this.gameOver();
                this.gameOverStatus = true;
            } else {
                this.playerProgress.checkPassed = false;
                this.gameOverStatus = false
            }
        }
        //create retry 
        const enterJustPressed = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER))
        if (enterJustPressed && this.gameOverStatus == true) {
            this.scene.start('GameSceneKey')
        }
        
        //check if out of fuel
        if (this.fuelUsed <= 0){
            this.fuelUsed = 0;
            this.outOfFuel();
        }

    }
}

export default GameScene;