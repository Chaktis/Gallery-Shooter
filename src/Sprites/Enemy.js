class Enemy extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    constructor(scene, x, y, texture, frame, enemySpeed, scale, points, fireTime) {
        super(scene, x, y, texture, frame);

        //might need to load pathing here, or at least create option to pass in pathing
        this.scene = scene
        this.enemySpeed = enemySpeed;
        this.scale = scale
        this.scorePoints = points
        this.movingRight = true
        this.fireTime = fireTime //need two versions of firetime since one will be the countdown timer
        this.cooldown = fireTime //will compare against the static firetime to see if enough time has passed
        this.bullet = null
        this.bulletList = [];
        this.alive = true

        this.flipY = true
        scene.add.existing(this);

        return this;
    }

    update() {
        //literally the most basic movement ever but it works
        // Moving left
        if (this.x > (this.displayWidth/2) && this.movingRight) {
            this.x -= this.enemySpeed;
        }
        else {
            this.movingRight = false
        }

        // Moving right
        if (this.x < (game.config.width - (this.displayWidth/2)) && !this.movingRight) {
            this.x += this.enemySpeed;
        }
        else {
            this.movingRight = true
        }

        console.log(this.status)
    }
}