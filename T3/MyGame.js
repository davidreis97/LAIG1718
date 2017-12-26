/**
 * MyGame
 * @constructor
 */

function MyGame(scene, args) {
    CGFobject.call(this, scene);

    this.gameStates = [];

    this.processedMove = false;

    this.initBuffers();
};

MyGame.prototype = Object.create(CGFobject.prototype);
MyGame.prototype.constructor = MyGame;

MyGame.prototype.initBuffers = function () {
    var initialState = [[0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,1,2,1,0],
                        [0,0,1,0,0],
                        [0,0,0,0,0]];

    this.gameStates.push([initialState,BLACKS,[10,3,10,2]]);
}

MyGame.prototype.requestMove = function (column, line, selectedPiece, playerType){

    var latestGameState = this.gameStates[this.gameStates.length - 1];

    var board = this.jsListToProlog(latestGameState[0]);
    
    var playerNo = 1 - latestGameState[1];
    
    var WPieces = latestGameState[2][0];
    var WMixed = latestGameState[2][1];
    var BPieces = latestGameState[2][2];
    var BMixed = latestGameState[2][3];

    this.processedMove = false;

    this._getPrologRequest("moveRequest(" + board + "," + WPieces + "," + WMixed + "," + BPieces + "," + BMixed + "," + (playerNo+1) + "," + playerType + "," + selectedPiece + "," + line + "," + column + ")", this.processMoveResponse);
}

MyGame.prototype.getCurrentPlayerNo = function (){
    var latestGameState = this.gameStates[this.gameStates.length - 1];

    return 1 - latestGameState[1];
}

MyGame.prototype.getCurrentBoard = function (state){
    return this.gameStates[this.gameStates.length - 1][0];
}

MyGame.prototype.getCurrentPieceCount = function (){
    var latestGameState = this.gameStates[this.gameStates.length - 1];

    return latestGameState[2];
}

MyGame.prototype.getInitialPieceCount = function (){
    var latestGameState = this.gameStates[0];

    return latestGameState[2];
}

MyGame.prototype.parseChanges = function (previousState, newState) {
    var previousBoard = previousState[0];
    var newBoard = newState[0];

    var removedPieces = [];
    var addedPiece = null;

    for(var i = 0; i < previousBoard.length; i++){
        for (var j = 0; j < previousBoard[0].length; j++){
            if(newBoard[i][j] == 0 && previousBoard[i][j] != 0) {
                removedPieces.push([j,4-i,previousBoard[i][j]]);
            }else if(newBoard[i][j] != 0 && previousBoard[i][j] == 0){
                addedPiece = [j,4-i,newBoard[i][j]];
            }
        }
    }
    
    this.tabuleiro.applyChanges(addedPiece,removedPieces);
}

MyGame.prototype.processMoveResponse = function (data){
    try{
        var response = eval(data.target.response);
    }catch(e){
        console.error("Invalid move!"); //TODO - Graphical display
        console.error(data.target.response);

        return;
    }
    
    var latestGameState = this.game.gameStates[this.game.gameStates.length - 1];
    
    var playerNo = 1 - latestGameState[1];

    var gameState = [response[0], playerNo, response[1]];
    
    this.game.parseChanges(this.game.gameStates[this.game.gameStates.length - 1], response);

    this.game.gameStates.push(gameState);

    if(response[2] == 0){ //TODO - Graphical display
        console.log("WHITE WON");
    }else if(response[2] == 1){
        console.log("BLACK WON");
    }else if(response[2] == 2){
        console.log("TIE!");
    }else if(response[2] != 3){
        console.error("Unknown answer to game over request: " + response[2]);
    }
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
