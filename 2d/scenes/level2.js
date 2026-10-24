class GameScene2 extends Phaser.Scene {
    constructor() {
        super('GameScene2');
        this.SpawnX = 0;
        this.SpawnY = 0;
    }

    init(data) {
        this.SpawnX = data.spawnX || 100// Use a default value if data is missing
        this.SpawnY = data.spawnY || 465;
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        // this.add.image(960, 540, 'nyc').setSize(1920, 1080);
        this.platforms = this.physics.add.staticGroup();
        this.pillars = this.physics.add.staticGroup();
        const currentGameKey = this.sys.settings.key;
        this.scene.launch('UIScene', {
          gameKey: currentGameKey
        });
        const map = this.make.tilemap({
          key: 'map2',
          tileWidth: 128,
          tileHeight: 128
        });
        const tileset = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tileset, 0, 0);

        const solidTiles = [1];
        const teleTiles = 2;

        layer.setCollision(solidTiles);
        layer.setCollision(teleTiles);
        layer.setCollisionByProperty({ collides: true });
        const scaleFactor = map.tileWidth / tileset.tileWidth; // 32 / 128 = 0.25
        layer.setScale(0.5);

        layer.setTileIndexCallback(
            teleTiles,
            // The function that Phaser calls on collision
            () => {
                this.enterPortal('GameScene');
            },
            this
        );

        const passageX = -100; // X position where the passage starts
        const passageY = 384;   // Y position at the top of the level
        // const passageY = 512;
        const passageWidth = 64; // How wide the zone is
        const passageHeight = 128;

// 1. Create a rectangle object
        this.exitZone = this.add.rectangle(passageX, passageY, passageWidth, passageHeight, 0xff0000).setOrigin(0, 0);
        this.exitPlatform = this.physics.add.staticGroup();
        this.exitPlatform = this.add.rectangle(-190, 512, 200, 128).setOrigin(0, 0);

// 2. Enable physics on it and make it a STATIC trigger
        this.physics.world.enable(this.exitPlatform);
        this.exitPlatform.body.setAllowGravity(false); // Prevents it from falling
        this.exitPlatform.body.setImmovable(true);     // Prevents it from moving
        this.physics.world.enable(this.exitZone);
        this.exitZone.body.setAllowGravity(false); // Prevents it from falling
        this.exitZone.body.setImmovable(true);
        // const touchArea = this.add.rectangle(0, 0, 960, 1080).setOrigin(0, 0).setDepth(100).setInteractive();
        // const touchArea2 = this.add.rectangle(960, 0, 960, 1080).setOrigin(0, 0).setDepth(100).setInteractive();
        this.p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.t = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.player = new Player(this, this.SpawnX, this.SpawnY);
        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.player, this.exitPlatform);
        this.physics.add.overlap(
          this.player,
          this.exitZone,
          () => {
            this.enterPortal('GameScene', 1528, 465),
            null,
            this
          }
        )
        const worldWidth = map.width * 64;
        const worldHeight = map.height * 64;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(this.player, true, 0.04, 0.04, 0,   0);
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        // this.cameras.main.scrollX = -500;
    }

    update(time, delta) {
      this.player.update(time, delta);
      // this.projectile.update()
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
