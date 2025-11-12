class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'dude');
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.jumpHeight = 1500;
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.speed = 850;
        this.jumpVelocity = -1400;
        this.flipX = false;

        this.cooldownTime = 500;
        this.lastPressTime = 0;

        this.isSliding = false;
        this.slideDuration = 350;
        this.slideSpeedFactor = 1.8;
        this.slideBodyHeight = 15;

        this.setSize(23, 30);
        this.setOrigin(0.5, 0.5);
        this.setOffset(0, 0)
        this.setScale(3);

        this.space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.left = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.up = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.slideKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.setCollideWorldBounds(true);
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
            if (time > this.lastPressTime + this.cooldownTime) {
                this.bomb = new Projectile(this.scene, this.x, this.y);
                // this.physics.add.collider(this.bomb, this.pillars, this.bomb.hitTarget, null, this.bomb);
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
        if (this.body.touching.down) {
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
