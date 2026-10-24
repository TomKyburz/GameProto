class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, layer) {
        super(scene, x, y, 'bomb'); // Changed 'player' to 'dude' based on your GameScene preload
        scene.add.existing(this);
        scene.physics.world.enable(this);
        console.log(layer)
        scene.physics.add.collider(this, layer, this.hitTarget, null, this);
        this.setOrigin(0).setScale(2.5)
        this.setSize(5,5)
        this.setOffset(4.5, 4.5)
        this.body.setAllowGravity(false);
        // this.scene.physics.add.overlap(this.bomb, this.scene.pillars, this.hitTarget, null, this);
    }
    shoot(direction) {
      this.play('proj', true);
      let shootdir = direction ? -1 : 1;
      this.setVelocityX(1400 * shootdir);
    }
    hitTarget() {
        this.setVelocity(0);
        this.body.enable = false;
        this.play('projhit', true);
        this.once('animationcomplete-projhit', () => {
            this.destroy();
        });
    }
}
