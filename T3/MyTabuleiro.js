/**
 * MyTabuleiro
 * @constructor
 */

function MyTabuleiro(scene, args) {
    CGFobject.call(this, scene);

    this.debug = false;

    this.game = args[0];

    this.game.tabuleiro = this;

    this.state = "WAITING_FOR_PIECE"; //WAITING_FOR_PIECE, WAITING_FOR_POS, WAITING_FOR_GAME, DO_MOVE, MOVING_CAMERA

    this.nextMove = [-1,-1,-1]; //- Linha, Coluna, Piece

    this.boundingBoxes = [];

    this.showIllegalMove = true;

    this.ongoingAnimations = [];

    this.backFixedCamera = !this.scene.fixedCamera;

    this.count = 0;

    this.pieces = [];

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

    this.resetButton = new MyCube(this.scene,[2,1,2]);
    this.undoButton = new MyCube(this.scene,[2,1,2]);

    this.illegalMove = new MyCube(this.scene,[2,1,2]);
    this.illegalMove.setTexScale(this.scene.graph.textures["invalidMove"][1],this.scene.graph.textures["invalidMove"][2]);

    this.piecePool = new MyPiecePool(this.scene,this.game);
}


/* 
   0 - 3 = 
   0 - 25 = Coordenadas do tabuleiro
   30/31 = Reset/Undo
 */
MyTabuleiro.prototype.processPicks = function () 
{
    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i=0; i< this.scene.pickResults.length; i++) {
                var obj = this.scene.pickResults[i][0];
                if (obj)
                {
                    var index = this.scene.pickResults[i][1];
                    if(index == 30){ //Reset
                        this.pieces = [];
                        this.ongoingAnimations = [];
                        this.nextMove = [-1,-1,-1];
                        this.game.reset();
                        this.state = "WAITING_FOR_PIECE";
                    }else if(index == 31){ //Undo
                        this.pieces = [];
                        this.ongoingAnimations = [];
                        this.nextMove = [-1,-1,-1];
                        this.game.gameStates.pop();
                        this.game.gameStates.pop();
                        this.state = "WAITING_FOR_PIECE";
                    }else if(this.state == "WAITING_FOR_PIECE") {
                        this.nextMove[2] = index;
                        this.state = "WAITING_FOR_POS";
                    }else if(this.state == "WAITING_FOR_POS") {
                        this.nextMove[0] = (index%5);
                        this.nextMove[1] = 4-Math.floor(index/5);

                        this.game.requestMove(this.nextMove[0], this.nextMove[1], this.nextMove[2], this.getPlayerType(this.game.getCurrentPlayerNo()));
                        
                        this.state = "WAITING_FOR_GAME";
                    }
                }
            }
            this.scene.pickResults.splice(0,this.scene.pickResults.length);
        }       
    }
}
MyTabuleiro.prototype.display = function (){
    this.pieces = [];
    this.piecePool.reset();

    if (!this.scene.pickMode){
        this.processPicks();
    
        this.scene.clearPickRegistration();

        this.fullDisplay();
    }

    if (this.scene.pickMode || this.debug){
        this.miniDisplay();
    }
}

MyTabuleiro.prototype.applyChanges = function(newPiece,removedPieces){
    this.state = "DO_MOVE";

    this.nextMove = [-1,-1,-1];

    var ctrl_point_1 = [0,0,0.5];
    var ctrl_point_2 = [0,0,3];
    var ctrl_point_3 = [newPiece[0],newPiece[1],3];
    var ctrl_point_4 = [newPiece[0],newPiece[1],0.5];

    if (this.game.getCurrentPlayerNo() == WHITES){
        if(newPiece[2] == WHITE_PIECE){
            ctrl_point_1[0] = 7;
            ctrl_point_1[1] = 3;
            ctrl_point_2[0] = 7;
            ctrl_point_2[1] = 3;
        }
        if(newPiece[2] == HENGE_PIECE){
            ctrl_point_1[0] = 7;
            ctrl_point_1[1] = 1;
            ctrl_point_2[0] = 7;
            ctrl_point_2[1] = 1;
        }
    }else if (this.game.getCurrentPlayerNo() == BLACKS){
        if(newPiece[2] == BLACK_PIECE){
            ctrl_point_1[0] = -2;
            ctrl_point_1[1] = 3;
            ctrl_point_2[0] = -2;
            ctrl_point_2[1] = 3;
        }
        if(newPiece[2] == HENGE_PIECE){
            ctrl_point_1[0] = -2;
            ctrl_point_1[1] = 1;
            ctrl_point_2[0] = -2;
            ctrl_point_2[1] = 1;
        }
    }

    var anim = new MyBezierAnimation([ctrl_point_1,ctrl_point_2,ctrl_point_3,ctrl_point_4],3);
    var ref = [newPiece[0],newPiece[1]];

    this.ongoingAnimations.push([ref,anim,newPiece[2]]);

    for(var i = 0; i < removedPieces.length; i++){
        var ctrl_point_1 = [removedPieces[i][0],removedPieces[i][1],0.5];
        var ctrl_point_2 = [removedPieces[i][0],removedPieces[i][1],3];
        var ctrl_point_3 = [10 - removedPieces[i][0],10 - removedPieces[i][1],3];
        var ctrl_point_4 = [10 - removedPieces[i][0],10 - removedPieces[i][1],0.5];

        var anim = new MyBezierAnimation([ctrl_point_1,ctrl_point_2,ctrl_point_3,ctrl_point_4],3);
        var ref = [removedPieces[i][0],removedPieces[i][1],removedPieces[i][2]];

        this.ongoingAnimations.push([ref,anim]);
    }
}

MyTabuleiro.prototype.updateAnim = function (currTime){
    for(var i = 0; i < this.ongoingAnimations.length; i++){
        this.ongoingAnimations[i][1].update(currTime);
    }

    if(this.animating){
        if(this.count >= 200){
            this.state = "WAITING_FOR_PIECE";
            this.animating = false;
            this.count = 0;
        }

        this.count++;
        this.scene.camera.orbit(vec3.fromValues(0,0,0),Math.PI/200);
    }
}

MyTabuleiro.prototype.buttonDisplay = function (pickMode){
    var currentPlayer = this.game.getCurrentPlayerNo();

    this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,1,0,0);

        if (currentPlayer == WHITES && this.getPlayerType(currentPlayer) == HUMAN_PLAYER) {
            this.scene.translate(7,0,1.3);
        }else if(currentPlayer == BLACKS && this.getPlayerType(currentPlayer) == HUMAN_PLAYER){
            this.scene.translate(-2,0,-6.2);
            this.scene.rotate(Math.PI,0,1,0);
        }

        if(pickMode) this.scene.registerForPick(30, this.resetButton);

        this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["reset"][0]);
        this.scene.graph.materials["PIECE_MATERIAL"].apply();

        this.resetButton.display();
    this.scene.popMatrix();
    
    if(this.game.gameStates.length > 2){
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2,1,0,0);

            if (currentPlayer == WHITES && this.getPlayerType(currentPlayer) == HUMAN_PLAYER) {
                this.scene.translate(7,0,-6.2);
            }else if(currentPlayer == BLACKS && this.getPlayerType(currentPlayer) == HUMAN_PLAYER){
                this.scene.translate(-2,0,1.3);
                this.scene.rotate(Math.PI,0,1,0);
            }

            if(pickMode) this.scene.registerForPick(31, this.undoButton);
        
            this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["undo"][0]);
            this.scene.graph.materials["PIECE_MATERIAL"].apply();
            
            this.undoButton.display();
        this.scene.popMatrix();
    }

    if(this.showIllegalMove){
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2,1,0,0);

            if (currentPlayer == WHITES && this.getPlayerType(currentPlayer) == HUMAN_PLAYER) {
                this.scene.translate(2.5,0,-6.2);
            }else if(currentPlayer == BLACKS && this.getPlayerType(currentPlayer) == HUMAN_PLAYER){
                this.scene.translate(2.5,0,1.3);
                this.scene.rotate(Math.PI,0,1,0);
            }

            this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["invalidMove"][0]);
            this.scene.graph.materials["PIECE_MATERIAL"].apply();
        
            this.illegalMove.display();
        this.scene.popMatrix();
    }
    
}

MyTabuleiro.prototype.miniDisplay = function (){
    if(this.state == "WAITING_FOR_PIECE") {
        this.pieceChoosingDisplay(this.game.getCurrentPlayerNo(), true);
        this.buttonDisplay(true);
    }else if(this.state == "WAITING_FOR_POS") {
        this.miniBoardDisplay();
        this.buttonDisplay(true);
    }else if(this.state == "WAITING_FOR_GAME") {
        
    }else if(this.state == "DO_MOVE"){
        
    }else if(this.state == "MOVING_CAMERA"){

    }
}

MyTabuleiro.prototype.getPlayerType = function (playerNo) {
    if (playerNo == WHITES) {
        return this.scene.playerModes.indexOf(this.scene.whitePlayer);
    }else if(playerNo == BLACKS){
        return this.scene.playerModes.indexOf(this.scene.blackPlayer);
    }else{
        console.error("Unknown playerNo: " + playerNo);
    }
}

MyTabuleiro.prototype.getAnimation = function(piecePos){ //Careful - this function should be expected to return null
    for(var i = 0; i < this.ongoingAnimations.length; i++){
        if(this.ongoingAnimations[i][0][0] == piecePos[0] && this.ongoingAnimations[i][0][1] == piecePos[1]){
            if(this.ongoingAnimations[i][1].finished){
                this.ongoingAnimations.splice(i,1);
            }else{
                return this.ongoingAnimations[i];
            }
        }
    }

    return null;
}


MyTabuleiro.prototype.fixCamera = function (playerNo) {
    if(playerNo == WHITES && this.scene.fixedCamera && !this.backFixedCamera){
        this.scene.camera.setPosition(vec3.fromValues(4,18,0));
        this.scene.camera.setTarget(vec3.fromValues(0,3,0));
    }else if (playerNo == BLACKS && this.scene.fixedCamera && !this.backFixedCamera){
        this.scene.camera.setPosition(vec3.fromValues(-4,18,0));
        this.scene.camera.setTarget(vec3.fromValues(0,3,0));
    }
    this.backFixedCamera = this.scene.fixedCamera;

}

MyTabuleiro.prototype.fullDisplay = function (){
    if((this.state == "WAITING_FOR_PIECE" || this.state == "WAITING_FOR_POS") && this.getPlayerType(this.game.getCurrentPlayerNo()) != HUMAN_PLAYER){
        this.game.requestMove("_", "_", "_", this.getPlayerType(this.game.getCurrentPlayerNo()));
        this.state = "WAITING_FOR_GAME";
    }

    /*
    var button = new MyCube(this.scene,[1,5,10]); //TEST CODE; REMOVE
    button.display();*/
    
    this.generatePieces();

    if(this.state == "WAITING_FOR_PIECE") {
        this.fullBoardDisplay();
        this.pieceChoosingDisplay(this.game.getCurrentPlayerNo(), false);
        this.buttonDisplay(false);
        this.fixCamera(this.game.getCurrentPlayerNo());
    }else if(this.state == "WAITING_FOR_POS") {
        this.fullBoardDisplay();
        this.pieceChoosingDisplay(this.game.getCurrentPlayerNo(), false);
        this.buttonDisplay(false);
        this.fixCamera(this.game.getCurrentPlayerNo());
    }else if(this.state == "WAITING_FOR_GAME") {
        this.fullBoardDisplay();
        this.pieceChoosingDisplay(this.game.getCurrentPlayerNo(), false);
        this.fixCamera(this.game.getCurrentPlayerNo());
    }else if(this.state == "DO_MOVE"){
        this.fullBoardDisplay();
        this.fixCamera(this.game.getCurrentPlayerNo());
        //this.pieceChoosingDisplay(this.game.getCurrentPlayerNo(), false);
        if(this.ongoingAnimations.length == 0){
            this.state = "MOVING_CAMERA";
            this.animating = true;
        }
    }else if(this.state == "MOVING_CAMERA"){
        this.fullBoardDisplay();
        this.pieceChoosingDisplay(this.game.getCurrentPlayerNo(), false);

        if (this.scene.fixedCamera){
            this.animating = true;
        }else{
            this.animating = false;
            this.count = 0;
            this.state = "WAITING_FOR_PIECE";
        }
    }else{
        console.log("UNKNOWN STATE: " + this.state);
    }

    for(var i = 0; i < this.pieces.length; i++) {
        var anim = this.getAnimation(this.pieces[i].pos);
        var backup = this.pieces[i].pos;
        if (anim){
            this.scene.pushMatrix();
            if(anim[1].started){
                this.pieces[i].pos = [0,0];
                this.scene.multMatrix(anim[1].transformMatrix);
            }else{
                this.pieces[i].pos[0] = anim[1].ctrl_points[0][0];
                this.pieces[i].pos[1] = anim[1].ctrl_points[0][1];
            }
        }
        this.pieces[i].display();
        if (anim){
            this.scene.popMatrix();
            if(anim[1].started){
                this.pieces[i].pos = backup;
            }   
        }
    }
}

MyTabuleiro.prototype.pieceChoosingDisplay = function(playerNo, pickMode){
    var pieceCount = this.game.getCurrentPieceCount();

    if (playerNo == WHITES){
        if(pieceCount[0] > 0){
            var piece = null;
            if (pickMode) {piece = this.piecePool.getBoundingBox();}
            else {piece = this.piecePool.getPiece(WHITE_PIECE);}
            piece.pos = [7,3];
            if (pickMode) {this.scene.registerForPick(WHITE_PIECE, piece);}
            
            if (this.nextMove[2] == WHITE_PIECE && !pickMode){
                this.scene.setActiveShader(this.scene.selectableShader);
            }
            piece.display();
            if (this.nextMove[2] == WHITE_PIECE && !pickMode){
                this.scene.setActiveShader(this.scene.defaultShader);
            }
        }
        if(pieceCount[1] > 0){
            var piece = null;
            if (pickMode) {piece = this.piecePool.getBoundingBox();}
            else {piece = this.piecePool.getPiece(HENGE_PIECE);}
            piece.pos = [7,1];
            if (pickMode) {this.scene.registerForPick(HENGE_PIECE, piece);}

            if (this.nextMove[2] == HENGE_PIECE && !pickMode){
                this.scene.setActiveShader(this.scene.selectableShader);
            }
            piece.display();
            if (this.nextMove[2] == HENGE_PIECE && !pickMode){
                this.scene.setActiveShader(this.scene.defaultShader);
            }
        }
    }else if (playerNo == BLACKS){
        if(pieceCount[2] > 0){
            var piece = null;
            if (pickMode) {piece = this.piecePool.getBoundingBox();}
            else {piece = this.piecePool.getPiece(BLACK_PIECE);}
            piece.pos = [-2,3];
            if (pickMode) {this.scene.registerForPick(BLACK_PIECE, piece);}

            if (this.nextMove[2] == BLACK_PIECE && !pickMode){
                this.scene.setActiveShader(this.scene.selectableShader);
            }
            piece.display();
            if (this.nextMove[2] == BLACK_PIECE && !pickMode){
                this.scene.setActiveShader(this.scene.defaultShader);
            }
        }
        if(pieceCount[3] > 0){
            var piece = null;
            if (pickMode) {piece = this.piecePool.getBoundingBox();}
            else {piece = this.piecePool.getPiece(HENGE_PIECE);}
            piece.pos = [-2,1];
            if (pickMode) {this.scene.registerForPick(HENGE_PIECE, piece);}
            
            if (this.nextMove[2] == HENGE_PIECE && !pickMode){
                this.scene.setActiveShader(this.scene.selectableShader);
            }
            piece.display();
            if (this.nextMove[2] == HENGE_PIECE && !pickMode){
                this.scene.setActiveShader(this.scene.defaultShader);
            }
        }
    }
}

MyTabuleiro.prototype.miniBoardDisplay = function (){
    var i = 0;

    for(i = 0; i < this.boundingBoxes.length; i++) {
        this.scene.registerForPick(i, this.boundingBoxes[i]);
        
        this.boundingBoxes[i].display();
    }  
}

MyTabuleiro.prototype.fullBoardDisplay = function (){
    this.miniBoardDisplay();
}

MyTabuleiro.prototype.generatePieces = function(){
    var currentBoard = this.game.getCurrentBoard(this.state);

    for(var i = 0; i < currentBoard.length; i++){ 
        for(var j = 0; j < currentBoard[0].length; j++){
            if (currentBoard[i][j] != 0){
                var piece = this.piecePool.getPiece(currentBoard[i][j]);
                piece.pos = [j,4-i];
                this.pieces.push(piece);
            }
        }
    }

    for(var i = 0; i < this.ongoingAnimations.length; i++){
        if (!this.pieceInitialized(this.ongoingAnimations[i][0])) {
            var piece = this.piecePool.getPiece(this.ongoingAnimations[i][0][2]);
            piece.pos = [[this.ongoingAnimations[i][0][0]],[this.ongoingAnimations[i][0][1]]];
            this.pieces.push(piece);
        }
    }
}

MyTabuleiro.prototype.pieceInitialized = function(pos) {
    for(var i = 0; i < this.pieces.length; i++){
        if(this.pieces[i].pos[0] == pos[0] && this.pieces[i].pos[1] == pos[1]){
            return true;
        }
    }
    return false;
}
