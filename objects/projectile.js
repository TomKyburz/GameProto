class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bomb');
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setOrigin(0.5).setScale(2.5)
        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
    }
    create() {
      this.physics.add.collider(this, this.pillars, this.hitTarget, null, this);
    }
    shoot(direction) {
      this.play('proj', true);
      let shootdir = direction ? -1 : 1;
      this.setVelocityX(2000 * shootdir);
    }
    hitTarget() {
        console.log('direct hit');
        this.setVelocity(0);
        this.body.enable = false;
        this.play('projhit', true);
        this.once('animationcomplete-projhit', () => {
            this.destroy();
        });
    }
}
