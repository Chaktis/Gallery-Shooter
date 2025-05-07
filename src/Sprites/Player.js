class Player extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    constructor(scene, x, y, texture, frame, leftKey, rightKey, spaceKey, playerSpeed, scale, maxBullets, lives) {
        //initializes Phaser sprite object
        super(scene, x, y, texture, frame);

        this.scene = scene
        this.left = leftKey;
        this.right = rightKey;
        this.space = spaceKey
        this.playerSpeed = playerSpeed;
        this.scale = scale
        this.maxBullets = maxBullets
        this.lives = lives

        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.bulletList = [];
        
        //adds player sprite to the scene
        scene.add.existing(this);

        return this;
    }

    update() {
        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (this.x > (this.displayWidth/2)) {
                this.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.x < (game.config.width - (this.displayWidth/2))) {
                this.x += this.playerSpeed;
            }
        }
    }
}