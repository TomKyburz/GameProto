class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0)
    this.add.image(960, 540, 'nyc').setSize(1920, 1080)
    this.platforms = this.physics.add.staticGroup()
    this.pillars = this.physics.add.staticGroup()
    this.scene.run('UIScene')
    this.platforms.create(960, 1048, 'ground').setScale(15, 5).refreshBody()
    this.pillars.create(1920, 836, 'pillar').setScale(1, 1).refreshBody()
    const touchArea = this.add.rectangle(0, 0, 960, 1080).setOrigin(0, 0).setDepth(100).setInteractive()
    const touchArea2 = this.add.rectangle(960, 0, 960, 1080).setOrigin(0, 0).setDepth(100).setInteractive()
    this.p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
    this.t = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T)
    this.player = new Player(this, 100, 841)
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.player, this.pillars, this.enterPortal, null, this)

    this.physics.world.setBounds(0, 0, 1920, 1080)
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09)
    this.cameras.main.setZoom(2)
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
      this.cameras.main.setZoom(3)
    } else {
      this.cameras.main.setZoom(2)
    }
  }
  enterPortal() {
    const entryData = {
      from: 'left',
    }
    this.player.active = false
    this.player.setVelocity(0, 0)
    this.cameras.main.fade(500, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (camera, effect) => {
      this.scene.start('GameScene2')
    })
  }
}
