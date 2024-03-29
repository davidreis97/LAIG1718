/**
 * MyGame
 * @constructor
 */

function MyGame(scene, args) {
    CGFobject.call(this, scene);

    this.initBuffers();
};

MyGame.prototype = Object.create(CGFobject.prototype);
MyGame.prototype.constructor = MyGame;

MyGame.prototype.initBuffers = function () {
    this.gameStates = [];

    var initialState = [[0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0]];

    this.winner = null;

    this.replay = false;
    this.replayIndex = 0;

    this.replayStates = [];

    this.gameStates.push([initialState,BLACKS,[10,3,10,2]]);
}

MyGame.prototype.startReplay = function(){
    this.replay = true;
    this.replayIndex = 1;

    this.replayStates = [];

    for(var i = 0; i < this.gameStates.length; i++){
        this.replayStates.push(this.gameStates[i]);
    }

    this.gameStates = [this.replayStates[0]];
}

MyGame.prototype.reset = function (){
    this.initBuffers();
}

MyGame.prototype.requestMove = function (column, line, selectedPiece, playerType){

    if(this.replay){
        this.parseChanges([this.getCurrentBoard()],this.replayStates[this.replayIndex]);

        this.gameStates.push(this.replayStates[this.replayIndex]);

        this.replayIndex++;

        if(this.replayIndex >= this.replayStates.length){
            this.tabuleiro.state = "GAME_ENDED";
            this.replay = false;
            this.replayIndex = 1;
        }

        return;
    }

    var latestGameState = this.gameStates[this.gameStates.length - 1];

    var board = this.jsListToProlog(latestGameState[0]);
    
    var playerNo = 1 - latestGameState[1];
    
    var WPieces = latestGameState[2][0];
    var WMixed = latestGameState[2][1];
    var BPieces = latestGameState[2][2];
    var BMixed = latestGameState[2][3];

    this._getPrologRequest("moveRequest(" + board + "," + WPieces + "," + WMixed + "," + BPieces + "," + BMixed + "," + (playerNo+1) + "," + playerType + "," + selectedPiece + "," + line + "," + column + ")", this.processMoveResponse);
}

MyGame.prototype.getCurrentPlayerType = function (){
    if(this.replay){
        return EASY_CPU_PLAYER;
    }else{
        return this.getPlayerType(this.getCurrentPlayerNo());
    }
}

MyGame.prototype.undo = function(){
    this.gameStates.pop();

    if(!this.winner){
        this.gameStates.pop();
    }

    this.winner = null;
}

MyGame.prototype.getPlayerType = function (playerNo) {
    if (playerNo == WHITES) {
        return this.scene.playerModes.indexOf(this.scene.whitePlayer);
    }else if(playerNo == BLACKS){
        return this.scene.playerModes.indexOf(this.scene.blackPlayer);
    }else{
        console.error("Unknown playerNo: " + playerNo);
    }
}

MyGame.prototype.getCurrentPlayerNo = function (){
    var latestGameState = this.gameStates[this.gameStates.length - 1];

    if (this.winner != null && this.tabuleiro.state == "GAME_ENDED"){
        return latestGameState[1];
    }else{
        return 1 - latestGameState[1];
    }
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
        this.game.tabuleiro.nextMove = [-1,-1,-1];
        this.game.tabuleiro.resetGraphics();
        console.log(this.game.tabuleiro.showIllegalMove);
        this.game.tabuleiro.showIllegalMove = true;
        console.log(this.game.tabuleiro.showIllegalMove);
        return;
    }
    
    var latestGameState = this.game.gameStates[this.game.gameStates.length - 1];
    
    var playerNo = 1 - latestGameState[1];

    var gameState = [response[0], playerNo, response[1]];
    
    this.game.parseChanges(this.game.gameStates[this.game.gameStates.length - 1], response);

    this.game.gameStates.push(gameState);

    if(response[2] != 3){ //TODO - Graphical display
        this.game.tabuleiro.state = "GAME_ENDED";
        this.game.winner = response[2];
    }else if(response[2] > 3 || response[2] < 0){
        console.error("Unknown answer to game over request: " + response[2]);
    }
}

MyGame.prototype.getCurrentEaten = function (player) {
    var initialCount = this.gameStates[0][2];
    var currentCount = this.getCurrentPieceCount();

    if(player == WHITES){
        return initialCount[0] - (currentCount[0] + this.getOnBoard(WHITE_PIECE));
    }else{
        return initialCount[2] - (currentCount[2] + this.getOnBoard(BLACK_PIECE));
    }
}

MyGame.prototype.getOnBoard = function(piece){
    var board = this.getCurrentBoard();
    var total = 0;
    for(var i = 0; i < board.length; i++){
        for (var j = 0; j < board[0].length; j++){
            if(board[i][j] == piece) {
                total++;
            }
        }
    }
    return total;
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
