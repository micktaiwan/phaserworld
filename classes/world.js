import {Files} from "../imports/api/tiles/collections.js";

require('phaser');

export class World extends Phaser.Game {

  constructor(config) {
    super(config);
    this.scene.add('Scene', new Scene(), false);
    console.log('world constructed');
  }

  startScene() {
    this.scene.start('Scene');
  }

}

class Scene extends Phaser.Scene {

  constructor() {
    super({
      key: 'Scene',
      physics: {
        arcade: {},
      },

    });
    this.zoom = 2;
    this.setSpeed(200);
  }

  setSpeed(speed) {
    this.speed = speed;
    this.frameRate = Math.ceil(this.speed / 20);
  }

  putTile(x, y, fileId) {
    console.log('putTile', fileId);
    this.add.image(x, y, fileId).setOrigin(0, 0);
  }

  preload() {
    console.log('preload');
    this.load.spritesheet('player', 'img/perso1.png', {frameWidth: 16, frameHeight: 32});

    const files = Files.find().each();
    console.log(files);
    const self = this;
    _.each(files, f => {
      console.log(f.link());
      self.load.image(f._id, f.link());
    });

  }

  create() {
    console.log('create');

    this.keyZ = this.input.keyboard.addKey('Z');
    this.keyQ = this.input.keyboard.addKey('Q');
    this.keyS = this.input.keyboard.addKey('S');
    this.keyD = this.input.keyboard.addKey('D');

    this.cursors = this.input.keyboard.createCursorKeys();

    this.mouse = this.input.mouse;
    // console.log(this.cursors, this.mouse);

    this.cameras.main.setBounds(0, 0, 1024, 2048);
    this.cameras.main.setZoom(this.zoom);
    this.cameras.main.centerOn(0, 0);

    this.input.on('pointerdown', function() {
      // this.cameras.main.centerOn(100, 100);
      const diffX = this.mouse.manager.activePointer.position.x / this.zoom - this.player.body.position.x;
      const diffY = this.mouse.manager.activePointer.position.y / this.zoom - this.player.body.position.y;
      // console.log(this.player.body.position.x, this.mouse.manager.activePointer.position.x, diffX);
      this.player.setVelocityX(diffX * 20);
      this.player.setVelocityY(diffY * 20);
    }, this);

    this.player = this.physics.add.sprite(384, 32, 'player');
    // this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {start: 0, end: 5}),
      frameRate: this.frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {start: 6, end: 11}),
      frameRate: this.frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {start: 12, end: 17}),
      frameRate: this.frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {start: 18, end: 23}),
      frameRate: this.frameRate,
      repeat: -1,
    });
  }

  update() {
    // Phaser.Input.Keyboard.KeyCodes
    if(this.cursors.shift.isDown) this.setSpeed(300);
    else this.setSpeed(100);
    if(this.cursors.left.isDown || this.keyQ.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.setVelocityY(0);
      this.player.anims.play('left', true);
    }
    else if(this.cursors.right.isDown || this.keyD.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.setVelocityY(0);
      this.player.anims.play('right', true);
    }
    else if(this.cursors.up.isDown || this.keyZ.isDown) {
      this.player.setVelocityY(-this.speed);
      this.player.setVelocityX(0);
      this.player.anims.play('up', true);
    }
    else if(this.cursors.down.isDown || this.keyS.isDown) {
      this.player.setVelocityY(this.speed);
      this.player.setVelocityX(0);
      this.player.anims.play('down', true);
    }
    else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
      this.player.anims.pause();
    }
  }
}
