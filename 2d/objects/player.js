class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player'); // Changed 'player' to 'dude' based on your GameScene preload
        scene.add.existing(this);
        scene.physics.world.enable(this);
        // Core Movement Properties
        this.jumpHeight = 1050;
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.speed = 400; // Using this as base horizontal speed
        this.jumpVelocity = -1400;
        this.flipX = false;
        this.body.onCollide = true;
        this.body.useDamping = true;

        // Shooting Cooldown Properties
        this.cooldownTime = 500;
        this.lastPressTime = 0;

        // Sliding Properties
        this.isSliding = false;
        this.slideDuration = 350; // Slide duration in ms
        this.slideSpeedFactor = 1.8; // Slide speed multiplier
        this.slideBodyHeight = 15; // Halved height for slide

        this.setSize(50, 370);
        // this.setOrigin(5, 5);
        this.setOffset(100,0)
        this.setScale(0.4, 0.25);

        // Input Registration
        this.space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.left = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.up = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // *** NEW: Register 'Z' for slide ***
        this.slideKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.Cursors = scene.input.keyboard.createCursorKeys();
        // this.setCollideWorldBounds(true);
    }

    startSlide() {
        this.isSliding = true;
        this.body.setSize(23, 15, true);
        this.body.setOffset(0, 30 - 15);
        const direction = this.flipX ? -1 : 1;
        this.setVelocityX(this.speed * this.slideSpeedFactor * direction);
        this.anims.play('slide', true)
        this.anims.stop();
        this.scene.time.delayedCall(this.slideDuration, this.stopSlide, [], this);
    }
    stopSlide() {
        this.isSliding = false;
        this.body.setSize(23, 30, true);
        this.body.setOffset(0, 0);
        this.setVelocityX(0);
        this.anims.play('turn', true);
    }

    update(time, delta) {
        if (this.slideKey.isDown && this.body.touching.down && !this.isSliding) {
            this.startSlide();
        }
        if (this.isSliding) {
            const direction = this.flipX ? -1 : 1;
            this.setVelocityX(this.speed * this.slideSpeedFactor * direction);
            return;
        }
        if (this.space.isDown) {
          const layer = this.scene.currentScene;
          // console.log(this.scene.currentScene)
            if (time > this.lastPressTime + this.cooldownTime) {
                this.bomb = new Projectile(this.scene, this.x, this.y, layer);
                this.bomb.shoot(this.flipX);
                this.lastPressTime = time;
            }
        }
        if (this.left.isDown) {
            this.flipX = true;
            this.moveHorizontal();
        } else if (this.right.isDown) {
            this.flipX = false
            this.moveHorizontal();
        } else {
            this.setVelocityX(0);
            this.anims.play('turn');
        }

        if (this.body.blocked.down) {
        this.jumpCount = 0;
        }

        if ((this.up.isDown) && this.jumpCount < this.maxJumps) {
            if (!this.lastJumpKeyIsDown) {
                if (this.jumpCount == 0) {
                    this.anims.play('jump');
                    this.setVelocityY(-this.jumpHeight);
                    this.jumpCount++;
                } else if (this.jumpCount == 1) {
                    this.anims.play('jump2');
                    this.setVelocityY(-this.jumpHeight);
                    this.jumpCount++;
                }
            }
        }
        this.lastJumpKeyIsDown = this.up.isDown
    }
    moveHorizontal() {
      if (this.flipX == false) {
        this.setVelocityX(this.speed);
        this.anims.play('right', true);
      } else if (this.flipX == true){
        this.setVelocityX(-this.speed);
        this.anims.play('right', true);
      }
    }
}
