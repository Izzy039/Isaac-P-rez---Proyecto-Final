const JUMP_VELOCITY = 300;
const OFFBOUNDS_THRESHOLD = 15;

export default class Dino extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
        scene.input.keyboard.on("keydown-SPACE", this.jump, this);
        this.blocked = false;
    }

    jump(){
        this.body.velocity.y = -JUMP_VELOCITY;
    }

    checkOffbounds (callback) {
        if(this.getBounds().top < 0 - OFFBOUNDS_THRESHOLD || this.getBounds().bottom > this.scene.config.height + OFFBOUNDS_THRESHOLD) {
            callback();
        }
     }
}