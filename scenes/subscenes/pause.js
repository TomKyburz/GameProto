class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    preload() {
        this.load.image('menu', 'assets/menu.png');
    }

    create() {
        this.p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        const dimmingOverlay = this.add.rectangle(960,540,1920,1080,0x000000,0.7);

        var button = this.add.image(960, 540, 'menu').setOrigin(0.5, 0.5).setScale(1);
        var title = this.add.text(960, 300, 'PAUSE', {font:'bold 40px Tahoma',fill:'#fff'}).setOrigin(0.5);
        const contain = this.add.container(960, 540);
        const containersA = [
          {text:'RESUME', y:420, scene:'GameScene'},
          {text:'OPTIONS', y:570, scene:'StatsScene'},
          {text:'QUIT', y:720, scene:'StatsScene'}
        ];

        for (const containers of containersA) {
          const contain = this.add.container(960, containers.y);
          var button = this.add.image(0, 0, 'board').setScale(1).setOrigin(0.5);
          var txt = this.add.text(0, 0, containers.text, {font:'bold 40px Tahoma',fill:'#fff'});
          txt.setOrigin(0.5, 0.5);
          contain.add(button);
          contain.add(txt);
          contain.setScale(1).setSize(266,96).setInteractive({useHandCursor:true});
          contain.on('pointerover', () => {
              contain.setScale(1.1);
          });
          contain.on('pointerout', () => {
              contain.setScale(1);
          });

          contain.on('pointerdown', () => {
            if (containers.scene == 'GameScene') {
              this.resume();
            } else {
              return;
            }
          });
     }
        // contain.add(txt);

    }

    update() {
      if (this.p.isDown) {
          this.resume();
      }
    }
    resume() {
      this.scene.resume('GameScene');
      this.scene.resume('UIScene');
      this.scene.stop();
    }
}
