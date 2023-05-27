
import Phaser, { Scenes } from "phaser";
import GameScene from "./scenes/main-scene";
import MenuScene from "./scenes/mainmenu-scene";

const GLOBAL_CONFIG = {
  width: 800,
  height: 600,
}

const config = {
  type: Phaser.AUTO,
  ...GLOBAL_CONFIG,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {y: 400}
    }
  },
  scene: [
    new MenuScene(GLOBAL_CONFIG),
    new GameScene(GLOBAL_CONFIG)
  ]
}
new Phaser.Game(config);