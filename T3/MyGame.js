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
    var initialState = [[1,2,3,0,0],
                        [0,0,0,0,0],
                        [0,0,1,0,0],
                        [0,2,0,0,0],
                        [3,0,0,0,0]];

    this.pieceCount = [10,3,10,2]; //Whites, WhiteHenges, Blacks, BlackHenges

    this.playerNo = WHITES;

    this.gameStates.push([initialState,this.playerNo,this.pieceCount/*,ANIMATION*/]);
}

MyGame.prototype.doMove = function (){
    console.log("Doing move (" + x + "," + y + ")");

   
}

MyGame.prototype._getPrologRequest = function (requestString, onSuccess, onError, port){
    console.log("Making request");
    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}
