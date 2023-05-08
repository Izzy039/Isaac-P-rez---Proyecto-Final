const TREE_SPAWN_TIME = 1500;
const TREE_VELOCITY = 200;
//Algunos obstáculos aparecen demasiado abajo
const TREE_SPAWN_RANGE = [650, 250];

export default class TreeSystem {
    constructor(scene, layer){
        this.scene = scene;
        this.layer = layer;
        this.group = scene.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.trees = [];
        this.pool = [];
        this.onTreeExit = ()=>{};
        this.spawnTimer = null;
    }

    start(){
        this.spawnTree();
        this.spawnTimer = this.scene.time.addEvent({
            delay: TREE_SPAWN_TIME,
            callback: ()=> {
                this.spawnTree();
            },
            loop: true
        })
    }

    stop() {
        this.stopped = true;
        this.spawnTimer.remove();
        this.trees.forEach(tree => {
            tree.setVelocity(0);
        })
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

    moveToPool(tree, index){
        this.trees.splice(index, 1);
        this.pool.push(tree);
        tree.setVelocity(0);
        tree.setVisible(false);
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