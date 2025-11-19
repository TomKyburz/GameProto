class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene')
  }

  preload() {
    this.load.image('btn', 'assets/button.png')
  }

  create() {
    const containersA = [
      { text: 'BACK', x: 120, y: 120, func: 'GameScene' },
      { text: '\u{2261}', x: 1800, y: 120, func: 'PauseScene' },
    ]

    for (const containers of containersA) {
      const backbtn = this.add.container(containers.x, containers.y)
      var button = this.add.image(0, 0, 'btn').setScale(1).setOrigin(0.5).setInteractive({ useHandCursor: true })
      var txt = this.add.text(0, 0, containers.text, { font: 'bold 50px Tahoma', fill: '#fff' })
      txt.setOrigin(0.5, 0.5)
      backbtn.add(button)
      backbtn.add(txt)
      backbtn.setScale(1)
      button.on('pointerdown', () => {
        if (containers.func == 'GameScene') {
          this.scene.stop('GameScene')
          this.scene.start('MenuScene')
        } else if (containers.func == 'PauseScene') {
          this.scene.run('PauseScene')
          this.scene.pause('UIScene')
          this.scene.pause('GameScene')
        }
      })
    }
  }
}
