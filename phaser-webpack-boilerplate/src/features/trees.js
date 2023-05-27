const TREE_SPAWN_TIME = 3500;
const TREE_VELOCITY = 200;
//Algunos obstáculos aparecen demasiado abajo, aún necesita ajustarse
const TREE_SPAWN_RANGE = [700, 250]; //Rango de aparición de meteoritos
const BOTTOM_OBSTACLE_SPAWN_RANGE = [650, 575]; //Rangos de aparición de árboles
const BOTTOM_OBSTACLE_SPAWN_TIME = 5000;
const BOTTOM_OBSTACLE_VELOCITY = 100;

export default class TreeSystem {
    constructor(scene, layer){
        this.scene = scene;
        this.layer = layer;
        this.group = scene.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.bottomGroup = scene.physics.add.group({
            allowGravity: false,
            immovable: true
          });

          this.trees = [];
          this.bottomObstacles = [];
          this.pool = [];
          this.bottomPool = [];
          this.onTreeExit = () => {};
          this.onBottomObstacleExit = () => {};
          this.spawnTimer = null;
          this.bottomSpawnTimer = null;
    }

    start(){
        this.clearPool();
        //this.spawnTree();
        this.spawnBottomObstacle();
        this.spawnTimer = this.scene.time.addEvent({
            delay: TREE_SPAWN_TIME,
            callback: ()=> {
                //this.spawnTree();
            },
            loop: true
        });

        this.bottomSpawnTimer = this.scene.time.addEvent({
            delay: BOTTOM_OBSTACLE_SPAWN_TIME,
            callback: () => {
              this.spawnBottomObstacle();
            },
            loop: true,
          });

          this.scene.time.delayedCall(10000, this.startTreeSpawning, [], this);
        }

        startTreeSpawning() {
            this.spawnTree();
            this.spawnTimer = this.scene.time.addEvent({
                delay: TREE_SPAWN_TIME,
                callback: () => {
                    this.spawnTree();
                },
                loop: true
            });
        }

    stop() {
        this.stopped = true;
        this.spawnTimer.remove();
        this.bottomSpawnTimer.remove();
        this.trees.forEach((tree) => {
            tree.setVelocity(0);
    });
        this.bottomObstacles.forEach((obstacle) => {
            obstacle.setVelocity(0);
    });
    }

    pause() {
        if (this.spawnTimer) {
            this.spawnTimer.paused = true;
        }
    }

    resume() {
        if(this.spawnTimer) {
            this.spawnTimer.paused = false;
        }
    }

    update (){
        for(let i = 0; i < this.trees.length; i++){
            const tree = this.trees[i];
            if(tree.hasLeftScreen()){
                this.moveToPool(tree, i);
                this.onTreeExit();
            }
        }

        for (let i = 0; i < this.bottomObstacles.length; i++) {
            const obstacle = this.bottomObstacles[i];
            if (obstacle.hasLeftScreen()) {
              this.moveToBottomPool(obstacle, i);
              this.onBottomObstacleExit();
            }
        }
    }

    spawnTree(){
        let tree = null;
        if(this.pool.length > 0){
            tree = this.pool[0];
            this.pool.splice(0, 1);
            tree.resetPosition();
        }
        else{
        tree = new Tree (this.group, this.scene.config.width, this.layer);
        }
        tree.setVelocity(TREE_VELOCITY);
        tree.setVisible(true);
        this.trees.push(tree);
        //console.log(this.trees);
    }

    spawnBottomObstacle(){
        let obstacle = null;
        if (this.bottomPool.length > 0) {
            obstacle = this.bottomPool[0];
            this.bottomPool.splice(0, 1);
            obstacle.resetPosition();
    } 
        else {
            obstacle = new BottomObstacle(this.group, this.scene.config.width, this.layer);
    }
        obstacle.setVelocity(BOTTOM_OBSTACLE_VELOCITY);
        obstacle.setVisible(true);
        this.bottomObstacles.push(obstacle);
    }

    moveToPool(tree, index) {
        this.trees.splice(index, 1);
        this.pool.push(tree);
        tree.setVelocity(0);
        tree.setVisible(false);
      }

      moveToBottomPool(obstacle, index) {
        this.bottomObstacles.splice(index, 1);
        this.bottomPool.push(obstacle);
        obstacle.setVelocity(0);
        obstacle.setVisible(false);
      }

      clearPool() {
        this.pool.forEach((tree) => tree.destroy());
        this.bottomPool.forEach((obstacle) => obstacle.destroy());
        this.pool = [];
        this.bottomPool = [];
      }

}

class Tree {
    constructor(group, spawnX, layer){
        this.group = group;
        this.spawnX = spawnX;
        this.treeSpawnPositionRange = TREE_SPAWN_RANGE;
        var spawnPosition = Phaser.Math.Between(...this.treeSpawnPositionRange);
        this.lower = group.create(spawnX, spawnPosition, "trees").setOrigin(0, 1);
        //Da escala aleatoria a los obstáculos
        var randomScale = Phaser.Math.Between(50, 150) / 100;
        this.lower.setScale(randomScale);
    }

    resetPosition(){
        //this.upper.x = this.spawnX;
        this.lower.x = this.spawnX;
        var spawnPosition = Phaser.Math.Between(...this.treeSpawnPositionRange);
        this.lower.y = spawnPosition;
    }

    setVelocity(velocity){
        //this.upper.body.velocity.x = -velocity;
        this.lower.body.velocity.x = -velocity;
    }

    setVisible(state){
        //this.upper.visible = state;
        this.lower.visible = state;
        }

    hasLeftScreen(){
        return this.lower.getBounds().right < 0;
    }
}

class BottomObstacle{
    constructor(group, spawnX, layer) {
        this.group = group;
        this.spawnX = spawnX;
        this.obstacleSpawnPositionRange = BOTTOM_OBSTACLE_SPAWN_RANGE;
        var spawnPosition = Phaser.Math.Between(...this.obstacleSpawnPositionRange);
        this.obstacle = group.create(spawnX, spawnPosition, "obstacle").setOrigin(0, 1);
        var randomScale = Phaser.Math.Between(50, 150) / 100;
        this.obstacle.setScale(randomScale);
    }

    resetPosition(){
        this.obstacle.x = this.spawnX;
        var spawnPosition = Phaser.Math.Between(...this.obstacleSpawnPositionRange);
        this.obstacle.y = spawnPosition;
    }

    setVelocity(velocity){
        this.obstacle.body.velocity.x = -velocity;
    }

    setVisible(state){
        this.obstacle.visible = state;
    }

    hasLeftScreen() {
        return this.obstacle.getBounds().right < 0;
      }
}