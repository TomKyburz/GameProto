class StatsScene extends Phaser.Scene {
    constructor() {
        super('StatsScene');
    }

    // 1. ADD THE PRELOAD METHOD
    preload() {
        // Load the image used in the create() method
        this.load.image('sky', 'assets/sky.png');
        this.load.image('player', 'assets/pillar.png');
        // Note: The MenuScene is also loading this, but adding it here
        // ensures the StatsScene is self-sufficient and won't crash.
    }

    create() {
      const displayString = `
      Welcome, LyteKey!

      Level: 80
      Winstreak: 2

      High Score: 55
      Games Played: 200
      `;
        this.add.image(960, 540, 'sky');
        this.add.text(960, 100, 'Player Statistics', { fontSize: '80px', fill: '#FFF' }).setOrigin(0.5);
        this.add.image(660, 540, 'player').setOrigin(0.5).setScale(9, 5);
        this.add.text(1020, 540, displayString, {
            fontSize: '50px',
            fill: '#FFF',
            // backgroundColor: '#000A',
            align: 'left',
            lineSpacing: 15
        }).setOrigin(0.5);
        // this.add.image(1260, 540, 'player').setScale(9, 5);


        // Get the logged-in player's ID and data from the global variables
        // const playerId = window.loggedInPlayerId;
        // const stats = window.playerStatsData[playerId];
        //
        // let displayString = '';
        //
        // if (stats) {
        //     displayString = `
        //     Welcome, ${stats.username}! (ID: ${playerId})
        //     -----------------------------------------
        //     Level: ${stats.level}
        //     High Score: ${stats.highScore.toLocaleString()}
        //     Games Played: ${stats.gamesPlayed}
        //     `;
        // } else {
        //     displayString = `Error: Player ID ${playerId} not found.`;
        // }
        //
        // // Display the stats
        // this.add.text(960, 300, displayString, {
        //     fontSize: '50px',
        //     fill: '#FFF',
        //     backgroundColor: '#000A',
        //     align: 'left',
        //     lineSpacing: 15
        // }).setOrigin(0.5);

        // --- BACK BUTTON ---
        const backButton = this.add.text(960, 950, 'BACK TO MENU', { fontSize: '60px', fill: '#F00', backgroundColor: '#0008' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene'); // Return to the main menu
        });

        // Add hover effect (Code omitted for brevity)
    }
}
