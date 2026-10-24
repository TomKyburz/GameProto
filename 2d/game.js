var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 4000 },
            debug: false
        }
    },
    scene: [
      MenuScene,

      GameScene,
      GameScene2,

      UIScene,
      PauseScene,
      StatsScene]
};

var game = new Phaser.Game(config);
