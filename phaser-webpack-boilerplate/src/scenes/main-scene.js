class GameScene extends Phaser.Scene{
    constructor(config){
        console.log("This is the main game scene");
        super(config);
        this.config = config;
        this.dino = null;
    }

preload(){
  //Cargar assets
  this.load.image("sky", "assets/SkySunset.png")
  this.load.image("dino", "assets/Dino1.png")
}

create(){
        //Cambia el pivote del cielo
        this.add.image(0, 0, "sky").setOrigin(0);
        //Dino
        this.dino = this.add.sprite(100, this.config.height/2, "dino");
        this.physics.add.existing(dino);

        this.dino.body.velocity.x = 50;
        //this.input.keyboard.on("keydown-SPACE", jump);
        //this.input.keyboard.on("keydown-S", duck);
        this.physics.add.collider(dino);
        this.dino.body.setCollideWorldBounds(true);
    }

    /*jump(){
        this.dino.body.velocity.y = -jumpVelocity;
    }

    duck(){
        this.dino.sprite(100, this.config.height / 2)
    }*/

}

export default GameScene