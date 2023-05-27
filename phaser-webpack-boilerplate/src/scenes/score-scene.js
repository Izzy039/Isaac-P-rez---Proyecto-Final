import TrexScene from "./trex-scene";

export default class ScoreScene extends TrexScene{
    constructor(config) {
        super("ScoreScene", config);
        //Jaja, el botón de score carga la escena, aún no averiguo porqué
    }

    create() {
        super.create();
        const loadedHighScore = parseInt(localStorage.getItem(HIGH_SCORE_SAVE_KEY));
        let highScoreValue = isNaN(loadedHighScore) ? 0 : loadedHighScore;
        const highScoreText = this.add.text(this.config.width / 2, this.config.height / 2, 
        HIGH_CORE_LABEL + highScoreValue, {fontSize: "32px"}).setOrigin(0.5);

        this.layers.ui.add(highScoreText);

        const back = this.add.text(this.config.width -16, 16, "Back", {fontSize: "24px"})
        .setOrigin(1, 0)
        .setInteractive();

        back.on("pointerup", ()=> {
            this.scene.start("MenuScene");
        });
        back.on("pointerover", ()=> back.setFill("#0F0"));
        back.on("pointerout", ()=> back.setFill("#FFF"));
    }
}