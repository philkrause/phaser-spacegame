import { Scene } from 'phaser';

class TitleScene extends Scene {
    constructor() {
        super({ key: 'TitleSceneKey' });

        this.startGameButton;
        this.cursors;
        this.allButtons = [];
        this.allButtonText = [];
        this.selectedButtonIndex = 0;
        this.buttonSelect;
        this.handCursor;
        this.titleImage;
        this.titleD = 0;
        this.playText;
        this.infoText;
        this.currentButtonTween;
        this.currentTextTween;
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
    }
    
    preload() 
    {
        this.load.image('title', './assets/images/title.png');
        this.load.image('panel', './assets/images/glassPanel.png');
        this.load.image('cursor', './assets/images/cursor_hand.png');
        this.load.bitmapFont('carrier_command', './assets/fonts/carrier_command.png', './assets/fonts/carrier_command.xml');
    }

    create() 
    {   
        const width = this.scale.width;
        const height = this.scale.height;
        this.input.addPointer(1);

        //title image
        this.titleImage = this.add.image(width*.5,height*.3,'title').setDisplaySize(width * .5,height * .5)

        //cursor image
		this.handCursor = this.add.image(0, 0, 'cursor').setScale(1.5)

        // Play button
        const playButton = this.add.image(width * 0.5, height * 0.68, 'panel').setDisplaySize(200, 95).setInteractive();
        const playText = this.add.bitmapText(playButton.x, playButton.y,'carrier_command','Play').setOrigin(0.5)

	    // About button
	    const aboutButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'panel').setDisplaySize(200, 95).setInteractive();
        const aboutText = this.add.bitmapText(playButton.x, playButton.y + playButton.displayHeight + 10,'carrier_command' ,'About').setOrigin(0.5);
        
        //controltext
        const controlsText = this.add.bitmapText(width * .2, playButton.y,'carrier_command','Left/Right: Turn').setOrigin(0.5).setScale(.3)

        //add buttons and text to arrays we can use later
        this.allButtons.push(playButton,aboutButton);
        this.allButtonText.push(playText,aboutText)

        // Initialize the selected button index
        this.selectButtonIndex = 0
        this.selectButton(this.selectButtonIndex)

        //event listeners for selecting 
        playButton.on('selected', () => {
            this.allButtons = []
            this.scene.start('GameSceneKey')
        })

        aboutButton.on('selected', () => {
            this.add.bitmapText(width * .8, aboutButton.y,'carrier_command','Made by\n\nphil krause\n\nv1.01').setOrigin(0.5).setScale(.3)
        })

        // Event listeners for selecting the Play button
        playButton.on('pointerdown', () => {
            // Handle touch input for the Play button here
            this.scene.start('GameSceneKey');
        });
    
        // Event listeners for selecting the About button
        aboutButton.on('pointerdown', () => {
            // Handle touch input for the About button here
            this.add.bitmapText(width * 0.8, aboutButton.y, 'carrier_command', 'Made by\n\nphil krause\n\nv1.01').setOrigin(0.5).setScale(0.3);
        });
        //clean up events
        this.events.once('shutdown', () => {
            playButton.off('pointerdown');
            aboutButton.off('pointerdown');
        });

    }

    //tinting the button
	selectButton(index)
	{   
        const currentButton = this.allButtons[this.selectedButtonIndex]
        currentButton.clearTint();

        // set the current selected button to a white tint
        currentButton.setTint(0xffffff)
    
        const button = this.allButtons[index]
        //set the newly selected button to a green tint
        button.setTint(0x66ff7f)
    
        // move the hand cursor to the right edge
        this.handCursor.x = button.x + button.displayWidth * 0.7
        this.handCursor.y = button.y + 10
    
        // store the new selected index
        this.selectedButtonIndex = index
	}



    //wrap the button index
    selectNextButton(change = 1)
    {
        let index = this.selectedButtonIndex + change
        if (index >= this.allButtons.length){index = 0}
        else if (index < 0) { index = this.allButtons.length - 1 }

        this.selectButton(index)
    }

    //create an event listener on the button called selected
	confirmSelection()
	{
		const button = this.allButtons[this.selectedButtonIndex]
        const text = this.allButtonText[this.selectedButtonIndex]
        button.emit('selected')
        text.emit('text')
	}

    update() {

        //key inputs
        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
		const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down)
		const enterJustPressed = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER))

        if (upJustPressed)
		{
			this.selectNextButton(-1)
		}
		else if (downJustPressed)
		{
			this.selectNextButton(1)
		}
        else if (enterJustPressed)
		{
			this.confirmSelection()
            
		}
    }
}

export default TitleScene; 