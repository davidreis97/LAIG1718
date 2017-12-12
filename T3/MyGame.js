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
    var initialState = [[0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0]];

    this.pieceCount = [10,3,10,2]; //Whites, WhiteHenges, Blacks, BlackHenges

    this.playerNo = WHITES;

    this.playerTypes = [0,1]; // 0- Human / 1- Easy AI / 2- Medium AI / 3- Hard AI

    this.gameStates.push([initialState,this.playerNo,this.pieceCount/*,ANIMATION*/]);

    this.requestMove(2,2,HENGE_PIECE);
}

MyGame.prototype.requestMove = function (column, line, selectedPiece){

    var latestGameState = this.gameStates[this.gameStates.length - 1];

    var board = this.jsListToProlog(latestGameState[0]);
    var WPieces = this.pieceCount[0];
    var WMixed = this.pieceCount[1];
    var BPieces = this.pieceCount[2];
    var BMixed = this.pieceCount[3];

    this._getPrologRequest("moveRequest(" + board + "," + WPieces + "," + WMixed + "," + BPieces + "," + BMixed + "," + (this.playerNo+1) + "," + this.playerTypes[this.playerNo] + "," + selectedPiece + "," + line + "," + column + ")", this.processMoveResponse);
}

MyGame.prototype.processMoveResponse = function (data){
    var response = data.target.response;

    //Convert string to array - Make recursive?
    //Send changes to graphics
    console.log(response);
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

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}
