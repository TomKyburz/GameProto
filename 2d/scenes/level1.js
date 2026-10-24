class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.SpawnX = 0;
        this.SpawnY = 0;
}

    init(data) {
      this.SpawnX = data.spawnX || 100;
      this.SpawnY = data.spawnY || 465;
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.platforms = this.physics.add.staticGroup();
        const currentGameKey = this.sys.settings.key;
        this.scene.launch('UIScene', {
          gameKey: currentGameKey
        });
        const map = this.make.tilemap({
          key: 'map',
          tileWidth: 128,
          tileHeight: 128
        });
        const tileset = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tileset, 0, 0);

        const solidTiles = [0];

        layer.setCollision(solidTiles);
        layer.setCollisionByProperty({ collides: true });
        layer.setScale(0.5);

        this.exitZone = this.add.rectangle(1545, 384, 64, 128, 0xff0000).setOrigin(0, 0);
        this.exitPlatform = this.add.rectangle(1537, 512, 200, 128, 0xff0000).setOrigin(0, 0);

        this.physics.world.enable(this.exitPlatform);
        this.exitPlatform.body.setAllowGravity(false).setImmovable(true);
        this.physics.world.enable(this.exitZone);
        this.exitZone.body.setAllowGravity(false).setImmovable();
        this.p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.t = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.player = new Player(this, this.SpawnX, this.SpawnY);
        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.player, this.exitPlatform)
        this.physics.add.overlap(
          this.player,
          this.exitZone,
          () => {
            this.enterPortal('GameScene2', 10, 465),
            null,
            this
          }
        )
        const worldWidth = map.width * 64;
        const worldHeight = map.height * 64;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(this.player, true, 0.04, 0.04, 0, 0);
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.currentScene = layer;
    }

    update(time, delta) {
      this.player.update(time, delta);
      if (this.p.isDown) {
          this.scene.run('PauseScene');
          this.scene.pause('UIScene');
          this.scene.pause();
      }
      if (this.t.isDown) {
        this.cameras.main.setZoom(4);
      } else {
        this.cameras.main.setZoom(2);
      }
  }
  enterPortal(exit, x, y) {
    this.player.active = false;
    this.player.setVelocity(0, 0);
    this.cameras.main.fade(500, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (camera, effect) => {
      this.scene.start(exit, {
        spawnX: x,
        spawnY: y
      });
    });
  }

}
