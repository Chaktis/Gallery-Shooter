class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, bulletSpeed, scale) {        
        super(scene, x, y, texture, frame);
        
        this.visible = false;
        this.active = false;
        this.speed = bulletSpeed
        this.scale = scale
        scene.add.existing(this)
        
        return this;
    }

    update() {
        if (this.active) {
            this.y -= this.speed;
            if (this.y < -(this.displayHeight/2)) {
                this.makeInactive();
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }

}