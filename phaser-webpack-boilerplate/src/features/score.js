const CURRENT_SCORE_LABEL = "Score";
const HIGH_SCORE_LABEL = "High score";
const HIGH_SCORE_SAVE_KEY = "high score";

export default class Score {
  constructor(scene, x, y, layer) {
    this.scene = scene;
    this.currentScoreValue = 0;
    this.highScoreValue = parseInt(localStorage.getItem(HIGH_SCORE_SAVE_KEY)) || 0;
    this.currentScoreText = scene.add.text(x, y, CURRENT_SCORE_LABEL + this.currentScoreValue).setOrigin(0);
    this.highScoreText = scene.add.text(x, y + 12, HIGH_SCORE_LABEL + this.highScoreValue).setOrigin(0);
    layer.add([this.currentScoreText, this.highScoreText]);

    // Configura el timer del score
    this.scoreInterval = setInterval(() => {
      this.addScore(1); // Incrementa el score cada 50milisegundos
      this.checkHighScore(); // Revisa el score constantemente
    }, 50);
  }

  addScore(amount) {
    this.currentScoreValue += amount;
    this.currentScoreText.setText(CURRENT_SCORE_LABEL + this.currentScoreValue);
  }

  checkHighScore() {
    if (this.currentScoreValue > this.highScoreValue) {
      this.highScoreValue = this.currentScoreValue;
      this.highScoreText.setText(HIGH_SCORE_LABEL + this.highScoreValue);
      localStorage.setItem(HIGH_SCORE_SAVE_KEY, this.highScoreValue);
    }
  }
}