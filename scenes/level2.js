class GameScene2 extends Phaser.Scene {
  constructor() {
    super('GameScene2')
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0)
    this.add.image(960, 540, 'nyc').setSize(1920, 1080)
    this.platforms = this.physics.add.staticGroup()
    this.pillars = this.physics.add.staticGroup()
    this.scene.run('UIScene')
    this.platforms.create(960, 1048, 'ground').setScale(15, 5).refreshBody()
    // this.pillars.create(50, 735, 'pillar').setScale(1, 3).refreshBody();
    this.pillars.create(0, 836, 'pillar').setScale(1, 1).refreshBody()

    const touchArea = this.add.rectangle(0, 0, 960, 1080).setOrigin(0, 0).setDepth(100).setInteractive()
    this.p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
    this.t = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T)
    this.player = new Player(this, 50, 841)
    this.physics.add.collider(this.player, this.platforms, this.applyDepthOffset, null, this)
    this.physics.add.collider(this.player, this.pillars, this.enterPortal, null, this)

    this.physics.world.setBounds(0, 0, 1920, 1080)
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09)
    this.cameras.main.setZoom(1.7)
    this.cameras.main.setBounds(0, 0, 1920, 1080)
  }

  update(time, delta) {
    this.player.update(time, delta)
    if (this.p.isDown) {
      this.scene.run('PauseScene')
      this.scene.pause('UIScene')
      this.scene.pause()
    }
    if (this.t.isDown) {
      this.cameras.main.fade(500, 0, 0, 0)
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (camera, effect) => {
        this.scene.start('GameScene')
      })
    }
  }
  enterPortal() {
    this.cameras.main.fade(500, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (camera, effect) => {
      this.scene.start('GameScene')
    })
  }
}
