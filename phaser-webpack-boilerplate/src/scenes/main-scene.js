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
  //Hay una advertencia en la consola de que falta el frame 5 en la spritesheet del Dino, no sé si tenga que ver que esta es cuadrada
  //El sprite del dino agachado no cambia tanto, pero juro que es diferente jaja
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
        //Llama al Tree System
        this.treeSystem = new TreeSystem (this, this.layers.game);
        //El sprite se mueve demasiado rápido en pantalla con esta velocidad
        //this.dino.body.velocity.x = 10;
        this.dinoCollision = this.physics.add.collider(this.dino, this.treeSystem.group, this.gameOver, null, this);
        //Evita que el sprite del Dino se salga del canvas
        this.dino.body.setCollideWorldBounds(true);
        //Crea botón de pausa
        this.pauseButton = this.add.sprite(this.config.width - 32, 32, "pauseButton").setInteractive();
        this.pauseButton.setScale(3);
        this.pauseButton.on("pointerup", this.pause, this);
        //Crea el score en pantalla e inicializa el conteo
        this.score = new Score(this, 16, 16, this.layers.ui);
        this.score.startUpdates();
        this.treeSystem.onTreeExit = ()=>{
          this.score.addScore(1);
        }

        //Inicia treeSystem
        this.treeSystem.start();
    }
    
  //Checa si se está en pausa o en Game Over y actualiza el score
  update(time, delta) {
    if(this.isGameOver || this.isPaused) {
      return;
    }

        this.treeSystem.update();
        this.dino.checkOffbounds(() => {
          this.gameOver();
        });

          this.score.update();
    }

    //Funciones para resumir y pausar el score
    pauseScore(){
      this.score.pauseUpdates();
    }

    resumeScore(){
      this.score.resumeUpdates();
    }

    //Pausa del juego
    pause() {
      this.physics.pause();
      this.treeSystem.pause();
      this.isPaused = true;
      this.pauseButton.setVisible(false);
      this.score.pauseUpdates();

      //El texto no desaparece de la pantalla al salir de la pausa
      //Agregarlo al layer de UI rompe algo, por ahora lo comentaré mientras encuentro un arreglo al problema
      /*const pauseText = this.add.text(
        this.config.width / 2,
        this.config.height / 2 - 100,
        "Pause",
        {fontSize: "48px", fill: "#FFF"}
      );
      pauseText.setOrigin(0.5);
      this.layers.ui.add(this.pauseText);*/

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

    //Para resumir el juego
    resume(){
      this.physics.resume();
      this.treeSystem.resume();
      this.isPaused = false;
      this.pauseButton.setVisible(true);
      this.score.resumeUpdates();
      this.hideMenu();
    }

  // Reinicio del juego
  restartGame() {
    this.isPaused = false;
    this.treeSystem.stop();
    //this.dinoCollision.destroy(); (removemos para reemplazarlo por lógica que reinicie el collider tras perder)
    if (this.dinoCollision) {
      this.physics.world.removeCollider(this.dinoCollision);
      this.dinoCollision = null;
    }
    this.scene.restart();
  }

  //Crea pantalla de Game Over
  createGameOverMenu() {
    const gameOverText = this.add.text(
      this.config.width / 2,
      this.config.height / 2 - 100,
      "You are exctinct!",
      {fontSize: "48px", fill: "#FFF"}
    );
    gameOverText.setOrigin(0.5);

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

  //Función de Game Over
    gameOver(){
        //Comentado todo lo que ya no es relevante para la pantalla de Game Over
        //alert("You lose");
        this.treeSystem.stop();
        this.dinoCollision.destroy();
        //this.scene.restart(); esto reinicia la escena automáticamente, se comenta porque ya no es necesario
        this.createGameOverMenu();
        this.score.stopUpdates();
      }

      //Función para salir del juego
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