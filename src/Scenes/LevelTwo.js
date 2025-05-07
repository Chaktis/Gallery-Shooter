class LevelTwo extends Phaser.Scene {
    constructor() {
        super("leveltwo");

        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        this.my.sprite.bullet = [];
        this.my.sprite.enemyBullets = [];   
        this.maxBullets = 7;
        this.bullet = null   
        
        //create an array to store enemy ships
        this.my.sprite.enemyShips = [];

        //keep track of whether or not the game has ended
        this.gameOver = false
    }

    preload() {

    }

    create() {
        // Create key objects
        let my = this.my;
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                
        // Add a tile map
        this.map = this.add.tilemap("map", 16, 16, 30, 20);

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("pixelShmupTileset", "mapTiles");

        // Create a tile map layer
        this.waterLayer = this.map.createLayer("waterLayer", this.tileset, 0, 0);
        this.landLayer = this.map.createLayer("landLayer", this.tileset, 0, 0);
        this.waterLayer.setScale(2.0);
        this.landLayer.setScale(2.0);

        // Create player class
        my.sprite.playerShip = new Player(this, game.config.width/2, game.config.height - 40, "playerShip", null,
            this.left, this.right, this.space, 6, 2, 5, 3);

        //spawn 5 enemy ships
        for (let i = 0; i < 5; i++) {
            let x = 100 + i * 200;
            let y = 200;
            my.sprite.enemyShips.push(new Enemy(this, x, y, "enemyShipG", null, 7, 2, 3, 50));
        }

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "explosion00" },
                { key: "explosion01" },
            ],
            frameRate: 10,    // Note: case sensitive (thank you Ivy!)
            repeat: 3,
            hideOnComplete: true,
        });

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Level Two.js</h2><br>A: left // D: right // Space: fire'

        // Put score on screen
        my.text.score = this.add.bitmapText(760, 0, "rocketSquare", "Score " + GameState.score);

        //display player lives
        this.my.text.lives = this.add.bitmapText(10, 0, "rocketSquare", "Lives: " + my.sprite.playerShip.lives);
    }

    update() {
        let my = this.my;

        console.log(my.sprite.enemyBullets)
        console.log(my.sprite.enemyShips)

        my.sprite.playerShip.update();
        //update all enemies in enemyShips array
        for (let enemy of my.sprite.enemyShips) {
            enemy.update();
        }
        
        //need to update each bullet in both lists
        for (let bullet of my.sprite.bullet){
            bullet.update();
        }
        for (let bullet of my.sprite.enemyBullets){
            bullet.update();
        }

        //removes bullets from the array once they go offscreen
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        my.sprite.enemyBullets = my.sprite.enemyBullets.filter((bullet) => bullet.y < game.config.height + bullet.displayHeight / 2); 

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < my.sprite.playerShip.maxBullets) {
                this.bullet = new Bullet(this, my.sprite.playerShip.x, my.sprite.playerShip.y - 40, "playerBullet", null, 10, 2,) 
                this.bullet.makeActive()
                my.sprite.bullet.push(
                    this.bullet  
                );
            }
        }

        //for each enemy fire bullet when cooldown up, otherwise progress cooldown
        for (let enemy of my.sprite.enemyShips){
            if (enemy.cooldown < 0 && enemy.alive) { 
                this.bullet = new Bullet(this, enemy.x, enemy.y + 30, "enemyBulletY", null, -8, 2,)
                this.bullet.makeActive()
                my.sprite.enemyBullets.push(
                    this.bullet    
                );  
                enemy.cooldown += enemy.fireTime;
            }
            else {
                enemy.cooldown -= 1;
            }
        }
        
        // Check for collision with the enemy ship
        for (let bullet of my.sprite.bullet) {
            for (let enemy of my.sprite.enemyShips) {
                if (this.collides(enemy, bullet)) {
                    // start animation
                    this.puff = this.add.sprite(enemy.x, enemy.y, "explosion01").setScale(3.0).play("puff");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                    enemy.visible = false;
                    enemy.y = -100;
                    enemy.alive = false
                    // Update score
                    GameState.score += enemy.scorePoints;
                    this.updateScore();
                }
            }
        }

        //check for collision with player
        for (let bullet of my.sprite.enemyBullets) {
            if (this.collides(my.sprite.playerShip, bullet)) {
                //reduce player life count
                my.sprite.playerShip.lives -= 1;
                my.text.lives.setText("Lives: " + my.sprite.playerShip.lives);

                // start animation
                this.puff = this.add.sprite(my.sprite.playerShip.x, my.sprite.playerShip.y, "explosion01").setScale(3.0).play("puff");
                
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.playerShip.visible = false;
                //don't have to bother making sure player can't fire if they're shooting into the void
                my.sprite.playerShip.y -= 1000;
                
                // Play sound
                this.sound.play("dadada", {
                    volume: 0.2   // Can adjust volume using this, goes from 0 to 1
                });
                
                // Want player to reappear at end of the animation if they still have lives
                if (my.sprite.playerShip.lives >= 1){
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    my.sprite.playerShip.visible = true;
                    my.sprite.playerShip.x = this.puff.x
                    my.sprite.playerShip.y += 1000;
                    }, this);
                }
                else {
                    this.endGame("lose")
                }
            }
        }

        if (my.sprite.enemyShips.every(enemy => !enemy.alive)) {
            this.endGame("win");
        }
    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + GameState.score);
    }


    endGame(status){
        //prevent function from calling multiple times and triggering both endings
        if (this.gameOver) return;
        this.gameOver = true

        let my = this.my;
         
        if (status == "win") {
            this.add.bitmapText(game.config.width/2 - 270, game.config.height/2 - 50, "rocketSquare", "You Won!", 100);
            this.add.bitmapText(game.config.width/2 - 260, game.config.height/2 + 50, "rocketSquare", "Press R to Play Again", 35);
            this.input.keyboard.once("keydown-R", () => {
                this.gameOver = false
                GameState.score = 0;
                this.scene.start("levelone");
            });
        }
        else {
            this.add.bitmapText(game.config.width/2 - 320, game.config.height/2 - 50, "rocketSquare", "Game Over", 100);
            this.add.bitmapText(game.config.width/2 - 225, game.config.height/2 + 50, "rocketSquare", "Press R to Restart", 35);
            this.input.keyboard.once("keydown-R", () => {
                this.gameOver = false
                GameState.score = 0;
                this.scene.start("levelone");
            });
        }


        //this is still massively scuffed
        for (let bullet of my.sprite.enemyBullets) {
            bullet.y += game.config.height;
        }
    
        //make sure to move this to lose once you create level two
        this.my.sprite.enemyShips = [];
    }
}
         