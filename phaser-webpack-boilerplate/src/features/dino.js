const JUMP_VELOCITY = 300;

export class Dino extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.input.keyboard.on("keydown-SPACE", this.jump, this);
    }

    jump(){
        this.body.velocity.y = JUMP_VELOCITY;
    }
}