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
    this.isStopped = false;
    this.isPaused = false;
    this.isGameOver = false;
    layer.add([this.currentScoreText, this.highScoreText]);

    // Configura el timer del score
    this.scoreInterval = null
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
  
    startUpdates() {
      this.scoreInterval = setInterval(() => {
        if (!this.isPaused) {
          this.addScore(1);
          this.checkHighScore();
        }
      }, 50);
    }
  
    stopUpdates() {
      clearInterval(this.scoreInterval);
    }
  
    resumeUpdates() {
      this.startUpdates();
    }
  
    pauseUpdates() {
      clearInterval(this.scoreInterval);
    }
  
    stop() {
      this.stopUpdates();
      this.isStopped = true;
    }
  
    update() {
      if (this.isGameOver || this.isPaused) {
        return;
      }
    }
  }