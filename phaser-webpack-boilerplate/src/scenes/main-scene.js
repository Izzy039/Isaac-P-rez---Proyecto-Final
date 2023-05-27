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
    }

preload(){
  //Carga assets
  this.load.image("sky", "assets/SkySunset.png")
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
        this.treeSystem = new TreeSystem (this, this.layers.game);
        //El sprite se mueve demasiado rápido en pantalla con esta velocidad
        //this.dino.body.velocity.x = 10;
        this.dinoCollision = this.physics.add.collider(this.dino, this.treeSystem.group, this.gameOver, null, this);
        //Evita que el sprite se salga del canvas
        this.dino.body.setCollideWorldBounds(true);
        this.pauseButton = this.add.sprite(this.config.width - 16, 16, "pauseButton").setInteractive();
        this.pauseButton.on("pointerup", this.pause, this);
        this.score = new Score(this, 16, 16, this.layers.ui);
        this.treeSystem.onTreeExit = ()=>{
          this.score.addScore(1);
        }

        //Inicia treeSystem
        this.treeSystem.start(); 
    }
    

  update() {
    if(this.isGameOver || this.isPaused) return;

        this.treeSystem.update();
        this.dino.checkOffbounds(() => {
          this.gameOver();
        });
}

    gameOver(){
        alert("You lose");
        this.treeSystem.stop();
        this.dinoCollision.destroy();
        //Reinicia la escena
        this.scene.restart();
      }

      pause() {
        this.physics.pause();
        this.treeSystem.pause();
        this.isPaused = true;
        this.pauseButton.setVisible(false);
      }
}