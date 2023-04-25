const TREE_SPAWN_TIME = 1000;
const TREE_VELOCITY = 200;

export default class TreeSystem {
    constructor(scene){
        this.scene = scene;
        this.group = scene.physics.add.group({
            allowGravity: false,
            inmovable: true
        });

        this.trees = [];
        this.pool = [];
    }

    start(){
        this.spawnTree();
        this.scene.time.addEvent({
            delay: TREE_SPAWN_TIME,
            callback: ()=> {
                this.spawnTree();
            },
            loop: true
        })
    }

    update (){
        for(let i = 0; i < this.trees.length; i++){
            const tree = this.trees[i];
            if(tree.hasLeftScreen()){
                this.moveToPool(tree, i);
            }
        }
    }

    spawnTree(){
        let tree = null;
        if(this.pool.length > 0){
            pipe = this.pool[0];
            this.pool.splice(0, 1);
            tree.resetPosition();
        }
        else{
            tree = new Tree (this.group, this.scene.config.width);
        }
        tree.setVelocity(TREE_VELOCITY);
        tree.setVisible(true);
        this.trees.push(tree);
        console.log(this.trees)
    }

    moveToPool(tree, index){
        this.trees.splice(index, 1);
        this.pool.push(pipe);
        tree.setVelocity(0);
        tree.setVisible(false);
    }

}

class Tree {
    constructor(group, spawnX){
        this.group = group;
        this.spawnX = spawnX;
        var spawnPosition = Phaser.Math.Between(...this.treeSpawnPositionRange);
        this.lower = group.create(spawnX, spawnPosition + gapSize, "tree").setOrigin(0);
    }

    resetPosition(){
        this.upper.x = this.spawnX;
        this.lower.x = this.spawnX;
    }

    setVisible(state){
        this.upper.visible = state;
        this.lower.visible = state;
        }

    hasLeftScreen(){
        return this.upper.getBounds().right < 0;
    }
}