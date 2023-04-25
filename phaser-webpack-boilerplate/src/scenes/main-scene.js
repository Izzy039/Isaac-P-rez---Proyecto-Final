import Dino from "../features/dino";

export default class GameScene extends Phaser.Scene{
    constructor(config){
        console.log("This is the main game scene");
        super(config);
        this.config = config;
        this.dino = null;
    }

preload(){
  //Carga assets
  this.load.image("sky", "assets/SkySunset.png")
  this.load.image("dino", "assets/Dino1.png")
}

create(){
        //Cambia el pivote del cielo
        this.add.image(0, 0, "sky").setOrigin(0);
        //Dino
        this.dino = new Dino (this, 100, this.config.height/2, "dino");
        this.physics.add.existing(dino);

        this.dino.body.velocity.x = 50;
        this.physics.add.collider(dino);
        this.dino.body.setCollideWorldBounds(true);
    }

}