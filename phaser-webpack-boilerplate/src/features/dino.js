const JUMP_VELOCITY = 300;
const OFFBOUNDS_THRESHOLD = 15;
const MINIMAL_SCALE = 0.5;

export default class Dino extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
        scene.input.keyboard.on("keydown-SPACE", this.jump, this);
        scene.input.keyboard.on("keydown-W", this.jump, this)
        scene.input.keyboard.on("keydown-S", this.duck, this);
        this.defaultScale = this.scaleX;
        this.isDucked = false;
        this.blocked = false;
    }

    //Salto
    jump(){
        this.body.velocity.y = -JUMP_VELOCITY;
    }

    //Agacharse, por el momento solo se reduce la escala
    //En la escala mínima el collider sale del canvas, lo cual triggerea un Game Over
    duck(){
        if(this.isDucked) {
            this.setScale(this.defaultScale);
            this.isDucked = false;
        }
        else {
            this.setScale(Math.max(this.scaleX * 0.5, MINIMAL_SCALE));
            this.isDucked = true;
        }
        
    }

    checkOffbounds (callback) {
        if(this.getBounds().top < 0 - OFFBOUNDS_THRESHOLD || this.getBounds().bottom > this.scene.config.height + OFFBOUNDS_THRESHOLD) {
            callback();
        }
     }

     //Update para verificar la escala
     update() {
        if(this.scene.input.keyboard.isDown(Phaser.input.keyboard.KeyCode.S)){
            this.reduceScale();
        }
     }
}