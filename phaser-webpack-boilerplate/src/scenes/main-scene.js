import Dino from "../features/dino";
import TreeSystem from "../features/trees";
import TrexScene from "./trex-scene";

export default class GameScene extends TrexScene{
    constructor(config){
        super("MainScene", config);
        this.dino = null;
        this.treeSystem = null;
        this.dinoCollision = null;
    }

preload(){
  //Carga assets
  this.load.image("sky", "assets/SkySunset.png")
  this.load.image("dino", "assets/Dino1.png")
  this.load.image("trees", "assets/meteor.png")
}

create(){
        //Dino
        super.create();
        this.dino = new Dino (this, 100, this.config.height/2, "dino");
        this.layers.game.add(this.dino);
        this.treeSystem = new TreeSystem (this, this.layers.game);
        this.dino.body.velocity.x = 10;
        this.dinoCollision = this.physics.add.collider(this.dino, this.treeSystem.group, this.gameOver, null, this);
        this.dino.body.setCollideWorldBounds(true);
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
        //this.isPaused = true;
        // this.pauseButton.setVisible(false);
      }

}