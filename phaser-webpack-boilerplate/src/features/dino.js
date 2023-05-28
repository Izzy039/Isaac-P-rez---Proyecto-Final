const JUMP_VELOCITY = 425;
const OFFBOUNDS_THRESHOLD = 15;
const MINIMAL_SCALE = 0.5;

export default class Dino extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
        this.canJump = true;
        this.isTouchingFloor = false;
        scene.input.keyboard.on("keydown-SPACE", this.jump, this);
        scene.input.keyboard.on("keydown-W", this.jump, this)
        scene.input.keyboard.on("keydown-S", this.duck, this);
        this.defaultScale = this.scaleX;
        this.isDucked = false;
        this.blocked = false;
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("dino", {start: 0, end: 6}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "duck",
            frames: this.anims.generateFrameNumbers("dino", {start: 7, end: 12}),
            frameRate: 8,
            repeat: -1
        });
        this.play("run");
    }

    touchingFloor(onFloor) {
    this.isTouchingFloor = onFloor;
  }

    //Salto le da velocidad al sprite en Y
    jump(){
        if (this.canJump) {
            this.body.velocity.y = -JUMP_VELOCITY;
            this.canJump = false;
            this.anims.pause();
            this.scene.time.delayedCall(2000, () => {
                this.canJump = true;
                this.anims.resume(); //Resume animaciones y resetea el booleano de salto tras 2 segundos
              });
          }
    }

    //Agacharse, por el momento solo se reduce la escala
    //Al cambiar de escala el collider a veces sale del canvas, lo cual triggerea un Game Over
    duck(){
        if(this.isDucked) {
            this.setScale(this.defaultScale);
            this.isDucked = false;
            this.play("run");
        }
        else {
            this.setScale(Math.max(this.scaleX * 0.75, MINIMAL_SCALE));
            this.play("duck");
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