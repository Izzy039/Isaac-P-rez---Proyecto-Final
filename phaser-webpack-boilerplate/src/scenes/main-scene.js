import Dino from "../features/dino";
import TreeSystem from "../features/trees";
import TrexScene from "./trex-scene";
import Score from "../features/score";

export default class GameScene extends TrexScene{
    constructor(config){
        super("MainScene", config);
        this.dino = null;
        this.treeSystem = null;
        this.dinoCollision = null;
        this.pauseButton = null;
        this.isGameOver = null;
        this.isPaused = false;
    }

preload(){
  //Carga assets
  //this.load.image("sky", "assets/SkySunset.png")
  this.load.spritesheet("dino", "assets/Dino1_Spritesheet.png", {frameWidth: 96, frameHeight: 96}) 
  this.load.image("trees", "assets/meteor.png")
  this.load.image("obstacle", "assets/tree-1.png")
  this.load.image("pauseButton", "assets/pause.png");
}

create(){
        //Dino
        super.create();
        this.dino = new Dino (this, 100, this.config.height/2, "dino");
        this.layers.game.add(this.dino);
        //Llama al Tree System, el delay parece no estar funcionando
        this.treeSystem = new TreeSystem (this, this.layers.game);
        //El sprite se mueve demasiado rápido en pantalla con esta velocidad
        //this.dino.body.velocity.x = 10;
        this.dinoCollision = this.physics.add.collider(this.dino, this.treeSystem.group, this.gameOver, null, this);
        //Evita que el sprite se salga del canvas
        this.dino.body.setCollideWorldBounds(true);
        this.pauseButton = this.add.sprite(this.config.width - 32, 32, "pauseButton").setInteractive();
        this.pauseButton.setScale(3);
        this.pauseButton.on("pointerup", this.pause, this);
        this.score = new Score(this, 16, 16, this.layers.ui);
        this.treeSystem.onTreeExit = ()=>{
          this.score.addScore(1);
        }

        //Inicia treeSystem
        this.treeSystem.start();
    }
    

  update(time, delta) {
    if(this.isGameOver || this.isPaused) return;

        this.treeSystem.update();
        this.dino.checkOffbounds(() => {
          this.gameOver();
        });
}

    pause() {
      this.physics.pause();
      this.treeSystem.pause();
      this.isPaused = true;
      this.pauseButton.setVisible(false);

    const continueButtonCallbacks = {
      onClick: this.resume,
      onMouseEnter: text => text.setFill("#0F0"),
      onMouseExit: text => text.setFill("#FFF"),
  }

    const quitButtonCallbacks = {
      onClick: this.quitGame,
      onMouseEnter: text => text.setFill("#F00"),
      onMouseExit: text => text.setFill("#FFF"),
    }

    const pauseMenu = {
      items: [
        {label: "Continue", style: {sontSize: "32px", fill: "#FFF"}, ...continueButtonCallbacks},
        {label: "Quit", style: {sontSize: "32px", fill: "#FFF"}, ...quitButtonCallbacks},
    ],


    firstItemPosition: {x: this.config.width / 2, y: this.config.height / 2},
    origin: {x: 0.5, y: 0.5},
    spacing: 45
    }

    this.showMenu(pauseMenu);
    }

    resume(){
      //Para resumir el juego
      this.physics.resume();
      this.treeSystem.resume();
      this.isPaused = false;
      this.pauseButton.setVisible(true);
      this.hideMenu();
    }



  restartGame() {
    // Reinicio del juego
    this.isPaused = false;
    this.treeSystem.stop();
    //this.dinoCollision.destroy(); (removemos para reemplazarlo por lógica que reinicie el collider tras perder)
    if (this.dinoCollision) {
      this.physics.world.removeCollider(this.dinoCollision);
      this.dinoCollision = null;
    }
    this.scene.restart();
  }

  createGameOverMenu() {
    const retryButtonCallbacks = {
      onClick: this.restartGame.bind(this),
      onMouseEnter: text => text.setFill("#0F0"),
      onMouseExit: text => text.setFill("#FFF"),
    };
  
    const quitButtonCallbacks = {
      onClick: this.quitGame.bind(this),
      onMouseEnter: text => text.setFill("#F00"),
      onMouseExit: text => text.setFill("#FFF"),
    };
  
    const gameOverMenu = {
      items: [
        { label: "Retry", style: { fontSize: "32px", fill: "#FFF" }, ...retryButtonCallbacks },
        { label: "Quit", style: { fontSize: "32px", fill: "#FFF" }, ...quitButtonCallbacks },
      ],
      firstItemPosition: { x: this.config.width / 2, y: this.config.height / 2 },
      origin: { x: 0.5, y: 0.5 },
      spacing: 45,
    };
  
    this.showMenu(gameOverMenu);
  }

    gameOver(){
      //Fin del juego
        //alert("You lose");
        this.treeSystem.stop();
        this.dinoCollision.destroy();
        //Reinicia la escena
        //this.scene.restart();
        this.createGameOverMenu();
      }

      quitGame() {
        //Regresa al menú al presionar "Quit"
        this.isPaused = false;
        this.treeSystem.stop();
       //this.dinoCollision.destroy();
       if (this.dinoCollision) {
        this.physics.world.removeCollider(this.dinoCollision);
        this.dinoCollision = null;
      }
        this.scene.start("MenuScene")
      }
}  
    
     