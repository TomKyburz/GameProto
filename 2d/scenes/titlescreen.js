  class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('bg', 'assets/background.png');
        this.load.image('board', 'assets/board.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('nyc', 'assets/nyc.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('button', 'assets/player.png', {frameWidth: 60, frameHeight: 30});
        this.load.spritesheet('bomb', 'assets/bomb.png', { frameWidth: 14, frameHeight: 14 });
        this.load.image('pillar', 'assets/pillar.png');
        this.load.tilemapCSV('map', 'scenes/tilemaps/map.csv');
        this.load.tilemapCSV('map2', 'scenes/tilemaps/map2.csv');
        this.load.image('tiles', 'scenes/tilemaps/spritesheet.png');
        this.load.spritesheet('player', 'assets/spritesheets/player.png', { frameWidth: 250, frameHeight: 392 });
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.add.image(960, 540, 'bg').setSize(1920, 1080);
        this.add.text(560, 100, 'TEST GAME 1', {
            font: 'bold 160px Tahoma',
            fill: '#fff'
        }).setOrigin(0.5);

        const containersA = [
          {text:'PLAY', y:450, scene:'GameScene'},
          {text:'OPTIONS', y:600, scene:'GameScene2'},
          {text:'STATS', y:750, scene:'StatsScene'}
        ];

        for (const containers of containersA) {
          const contain = this.add.container(260, containers.y);
          var button = this.add.image(0, 0, 'board').setScale(1).setOrigin(0.5);
          var txt = this.add.text(0, 0, containers.text, {font:'bold 35px Tahoma',fill:'#fff'});
          txt.setOrigin(0.5, 0.5);
          contain.add(button);
          contain.add(txt);
          contain.setScale(1).setSize(232,96).setInteractive({useHandCursor:true});
          contain.on('pointerover', () => {
              contain.setScale(1.1);
          });
          contain.on('pointerout', () => {
              contain.setScale(1);
          });
          contain.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (camera, effect) => {
              this.scene.start(containers.scene);
          });
          });
     }
     this.anims.create({
         key: 'projhit',
         frames: this.anims.generateFrameNumbers('bomb', { start: 1, end: 7 }),
         frameRate: 60,
         repeat: 0
     });

     this.anims.create({
         key: 'proj',
         frames: this.anims.generateFrameNumbers('bomb', { start: 0, end: 1 }),
         frameRate: 20,
     });

     this.anims.create({
         key: 'turn',
         frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
         frameRate: 10,
         repeat: -1
     });
     this.anims.create({
         key: 'right',
         frames: this.anims.generateFrameNumbers('player', { start: 1, end: 5 }),
         frameRate: 10,
         repeat: -1
     });
     this.anims.create({
         key: 'jump',
         frames: this.anims.generateFrameNumbers('player', { start: 7, end: 7 }),
         frameRate: 10,
         repeat: -1
     });
     this.anims.create({
         key: 'jump2',
         frames: this.anims.generateFrameNumbers('player', { start: 6, end: 6 }),
         frameRate: 10,
         repeat: -1
     });
     this.anims.create({
       frames: this.anims.generateFrameNumbers('player', { start: 6, end: 7 }),
         key: 'slide',
         frameRate: 10,
         repeat: -1
     });
  }
}
