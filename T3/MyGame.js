/**
 * MyGame
 * @constructor
 */

function MyGame(scene, args) {
    CGFobject.call(this, scene);

    this.gameStates = [];

    this.initBuffers();
};

MyGame.prototype = Object.create(CGFobject.prototype);
MyGame.prototype.constructor = MyGame;

MyGame.prototype.initBuffers = function () {
    var initialState = [[0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0]];

    this.playerTypes = [0,1]; // 0- Human / 1- Easy AI / 2- Medium AI / 3- Hard AI

    this.gameStates.push([initialState,BLACKS,[10,3,10,2]/*,ANIMATION*/]);

    this.requestMove(2,2,HENGE_PIECE);
}

MyGame.prototype.requestMove = function (column, line, selectedPiece){

    var latestGameState = this.gameStates[this.gameStates.length - 1];

    var board = this.jsListToProlog(latestGameState[0]);
    
    var playerNo = latestGameState[1];
    latestGameState[1] == WHITES ? playerNo = BLACKS : playerNo = WHITES;
    
    var WPieces = latestGameState[2][0];
    var WMixed = latestGameState[2][1];
    var BPieces = latestGameState[2][2];
    var BMixed = latestGameState[2][3];

    this._getPrologRequest("moveRequest(" + board + "," + WPieces + "," + WMixed + "," + BPieces + "," + BMixed + "," + (playerNo+1) + "," + this.playerTypes[playerNo] + "," + selectedPiece + "," + line + "," + column + ")", this.processMoveResponse);
}

MyGame.prototype.getCurrentPlayerNo = function (){
    var latestGameState = this.gameStates[this.gameStates.length - 1];

    return latestGameState[1];
}

MyGame.prototype.getCurrentPieceCount = function (){
    var latestGameState = this.gameStates[this.gameStates.length - 1];

    return latestGameState[2];
}

MyGame.prototype.getInitialPieceCount = function (){
    var latestGameState = this.gameStates[0];

    return latestGameState[2];
}

MyGame.prototype.processMoveResponse = function (data){
    var response = eval(data.target.response); //TRY AND CATCH HERE TO DETECT INVALID MOVES
    
    var latestGameState = this.game.gameStates[this.game.gameStates.length - 1];
    
    var playerNo = WHITES;
    latestGameState[1] == WHITES ? playerNo = BLACKS : playerNo = WHITES;

    var gameState = [response[0], playerNo, response[1]];
    
    this.game.gameStates.push(gameState);
}

MyGame.prototype.jsListToProlog = function(list) {
    var final = "[";

    for(var sublist = 0; sublist < list.length; sublist++){
        final += "["
        for (var item = 0; item < list[sublist].length; item++){
            final += list[sublist][item] + ",";
        }

        final = final.slice(0, -1);
        final += "],"
    }

    final = final.slice(0, -1);
    final += "]";
    return final;
}

MyGame.prototype._getPrologRequest = function (requestString, onSuccess, onError, port){
    console.log("Making request: " + requestString);
    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.game = this;

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}
