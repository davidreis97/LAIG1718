/**
 * MyTabuleiro
 * @constructor
 */

function MyTabuleiro(scene, args) {
    CGFobject.call(this, scene);

    this.debug = true;

    this.game = args[0];

    this.state = "WAITING_FOR_POS"; //WAITING_FOR_PIECE, WAITING_FOR_POS, WAITING_FOR_GAME, DO_MOVE, MOVING_CAMERA

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
                    console.log(this.customId);         
                }
            }
            this.scene.pickResults.splice(0,this.scene.pickResults.length);
        }       
    }
}

MyTabuleiro.prototype.display = function (){
    this.pieces = [];
    this.piecePool.reset();

    if(this.state == "WAITING_FOR_PIECE") {
        if (this.scene.pickMode || this.debug){
            this.miniPieceChoosingDisplay(this.game.getCurrentPlayerNo());
        }
    }else if(this.state == "WAITING_FOR_POS") {
        if (this.scene.pickMode || this.debug){
            this.miniBoardDisplay();
        }
    }else if(this.state == "WAITING_FOR_GAME") {
        
    }else if(this.state == "DO_MOVE"){
        
    }else if(this.state == "MOVING_CAMERA"){

    }

    if (!this.scene.pickMode){
        this.fullDisplay();
    }
}

MyTabuleiro.prototype.fullDisplay = function (){
    this.logPicking();
    
    this.scene.clearPickRegistration();

    this.generatePieces();

    for(var i = 0; i < this.pieces.length; i++) {
        this.pieces[i].display();
    }
}

MyTabuleiro.prototype.miniPieceChoosingDisplay = function(playerNo){
    var pieceCount = this.game.getCurrentPieceCount();

    if (playerNo == WHITES){
        if(pieceCount[0] > 0){
            var piece = this.piecePool.getPiece(WHITE_PIECE);
            piece.pos = [7,3];
            piece.display();
            this.scene.registerForPick(0, piece);
        }
        if(pieceCount[1] > 0){
            var piece = this.piecePool.getPiece(HENGE_PIECE);
            piece.pos = [7,1];
            piece.display();
            this.scene.registerForPick(1, piece);
        }
    }else if (playerNo == BLACKS){
        if(pieceCount[2] > 0){
            var piece = this.piecePool.getPiece(BLACK_PIECE);
            piece.pos = [-2,3];
            piece.display();
            this.scene.registerForPick(2, piece);
        }
        if(pieceCount[3] > 0){
            var piece = this.piecePool.getPiece(HENGE_PIECE);
            piece.pos = [-2,1];
            piece.display();
            this.scene.registerForPick(3, piece);
        }
    }
}

MyTabuleiro.prototype.miniBoardDisplay = function (){
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
}

MyTabuleiro.prototype.generatePieces = function(){
    var currentBoard = this.game.gameStates[this.game.gameStates.length - 1][0];

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
