require('phaser');

export class World {

  constructor() {

    const config = {
      type: Phaser.AUTO,
      parent: 'world',
      height: $(window).innerHeight(),
      width: $(window).innerWidth(),
      pixelArt: true,
      physics: {
        default: 'arcade',
      },
      scene: [Scene],
    };

    this.game = new Phaser.Game(config);

    console.log('world constructed');

  }

}

class Scene extends Phaser.Scene {
  constructor() {
    super();
    this.speed = 200;
  }

  preload() {
    this.load.spritesheet('player', 'img/perso1.png', {frameWidth: 16, frameHeight: 32});
  }

  create() {
    this.cameras.main.setBounds(0, 0, 1024, 2048);
    this.cameras.main.setZoom(2);
    this.cameras.main.centerOn(0, 0);
    this.input.on('pointerdown', () => {
      console.log('test');
      this.cameras.main.centerOn(100, 100);
    }, this);
    this.player = this.physics.add.sprite(384, 32, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {start: 0, end: 5}),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {start: 6, end: 11}),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {start: 12, end: 17}),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {start: 18, end: 23}),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'still',
      frames: [{key: 'player', frame: 18}],
      frameRate: 20,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    // console.log(this.cursors);
    if(this.cursors.left.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.setVelocityY(0);
      this.player.anims.play('left', true);
    }
    else if(this.cursors.right.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.setVelocityY(0);
      this.player.anims.play('right', true);
    }
    else if(this.cursors.up.isDown) {
      this.player.setVelocityY(-this.speed);
      this.player.setVelocityX(0);
      this.player.anims.play('up', true);
    }
    else if(this.cursors.down.isDown) {
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
