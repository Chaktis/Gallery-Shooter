// Erin Casey
// Template by Jim Whitehead
// Created: 5/3/2025
// Phaser: 3.70.0
// 
// Art assets from Kenny Assets:
// https://kenney.nl/assets/

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    fps: { forceSetTimeOut: true, target: 60 },   // ensure consistent timing across machines
    width: 960,
    height: 640,
    scene: [LevelOne, LevelTwo]
}


const game = new Phaser.Game(config);