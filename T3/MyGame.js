/**
 * MyGame
 * @constructor
 */

function MyGame(scene, args) {
    CGFobject.call(this, scene);

    this.gameStates = [];

    this.state = "WAITING_FOR_GRAPHIC_INPUT"; //WAITING_FOR_GRAPHIC_INPUT, WAITING_FOR_PROLOG

    this.initBuffers();
};

MyGame.prototype = Object.create(CGFobject.prototype);
MyGame.prototype.constructor = MyGame;

MyGame.prototype.initBuffers = function () {
    var initialState = [[1,0,0,0,2],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [3,0,0,0,0]];

    this.playerNo = WHITES;

    this.gameStates.push([initialState,this.playerNo,null]);
}

MyGame.prototype.doMove = function (x , y){
    console.log("Doing move (" + x + "," + y + ")");
 
    /* TODO
    anim = 
    playerNo =
    gameState = 

    this.gameStates.push([gameState,playerNo,anim]);
    */
}
