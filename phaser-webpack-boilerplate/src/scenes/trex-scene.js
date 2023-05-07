export default class TrexScene extends Phaser.Scene{
    constructor(sceneName, config) {
        super (sceneName)
        this.config = config;
        this.layers = {
            background: null,
            game: null,
            ui: null,
        }
        this.activeMenu = null;
    }

    create (){
        this.layers.background = this.add.layer();
        this.layers.game = this.add.layer();
        this.layers.ui = this.add.layer();
        const sky = this.add.image(0, 0, "sky").setOrigin(0);
        this.layers.background.add(sky);
    }
}