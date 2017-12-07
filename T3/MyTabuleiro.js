/**
 * MyTabuleiro
 * @constructor
 */

function MyTabuleiro(scene, args) {
    CGFobject.call(this, scene);

    this.debug = 1;

    this.game = args[0];

    this.state = "WAITING_FOR_POS"; //WAITING_FOR_PIECE, WAITING_FOR_POS, WAITING_FOR_GAME, DO_MOVE

    this.boundingBoxes = [];

    this.pieces = []; // 0-Whites, 1-WhiteHenge, 2-Blacks, 3-BlackHenge

    this.selectedPieceType = HENGE_PIECE; //Game must start with henge piece -- give visual feedback (shader)

    this.initBuffers();
};

MyTabuleiro.prototype = Object.create(CGFobject.prototype);
MyTabuleiro.prototype.constructor = MyTabuleiro;

MyTabuleiro.prototype.initBuffers = function () {
    for(var i = 0; i<5; i++){
        for(var j = 0; j<5; j++){
            var rect = new MyRectangle(this.scene,[0+j,1+i,1+j,0+i]);
            this.boundingBoxes.push(rect);
        }
    }

    this.piecePool = new MyPiecePool(this.scene,this.game);
}

MyTabuleiro.prototype.logPicking = function ()
{
    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i=0; i< this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];
                if (obj)
                {
                    this.customId = this.scene.pickResults[i][1];              
                }
            }
            this.scene.pickResults.splice(0,this.scene.pickResults.length);
        }       
    }
}

MyTabuleiro.prototype.display = function (){
    if (this.scene.pickMode || this.debug){
        this.miniDisplay(this.game.playerNo);
    }

    if (!this.scene.pickMode){
        this.fullDisplay();
    }
}

MyTabuleiro.prototype.fullDisplay = function (){
    this.logPicking();
    
    this.scene.clearPickRegistration();

    //this.generatePieces();

    for(var i = 0; i < this.pieces.length; i++) {
        //this.pieces[i].display();
    }
}


MyTabuleiro.prototype.miniDisplay = function (playerNo){
    var i = 0;

    for(i = 0; i < this.boundingBoxes.length; i++) {
        this.scene.registerForPick(i+1, this.boundingBoxes[i]);

        if(this.customId && this.customId == i + 1){
            this.scene.setActiveShader(this.scene.selectableShader);
        }
        
        this.boundingBoxes[i].display();
        
        if(this.customId && this.customId == i + 1){
            this.scene.setActiveShader(this.scene.defaultShader);
        }
    }  

    /*TODO - CREATE BOUNDING BOXES FOR PIECE - MABYE JUST ONE PER CASE IS ENOUGH*/

    this.generatePieces();

    for(var j = 0; j < this.pieces.length; j++, i++) {
        this.scene.registerForPick(i+1, this.pieces[j]);

        if(this.customId && this.customId == i + 1){
            this.scene.setActiveShader(this.scene.selectableShader);
        }

        this.pieces[j].display();

        if(this.customId && this.customId == i + 1){
            this.scene.setActiveShader(this.scene.defaultShader);
        }
    }
}

MyTabuleiro.prototype.generatePieces = function(){
    var currentBoard = this.game.gameStates[this.game.gameStates.length -1][0];

    this.piecePool.reset();
    this.pieces = [];

    for(var i = 0; i < currentBoard.length; i++){
        for(var j = 0; j < currentBoard[0].length; j++){
            if (currentBoard[i][j] != 0){
                var piece = this.piecePool.getPiece(currentBoard[i][j]);
                piece.pos = [j,4-i];
                this.pieces.push(piece);
            }
        }
    }
}
