/**
 * MyTabuleiro
 * @constructor
 */

function MyTabuleiro(scene, args) {
    CGFobject.call(this, scene);

    this.scene.debug = false;

    this.game = args[0];

    this.game.tabuleiro = this;

    this.state = "WAITING_FOR_PIECE"; //WAITING_FOR_PIECE, WAITING_FOR_POS, WAITING_FOR_GAME, DO_MOVE, MOVING_CAMERA, GAME_ENDED

    this.nextMove = [-1,-1,-1]; //- Linha, Coluna, Piece

    this.boundingBoxes = [];

    this.showIllegalMove = false;

    this.ongoingAnimations = [];

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

    this.previousTime = 0;

    this.timeLeft = MAX_TIME_LEFT;

    this.scene.whiteScore = 0;
    this.scene.blackScore = 0;

    this.board = new MyPatch(this.scene,[4,4,[[[0,0,0,1],[0,10,0,1]],[[10,0,0,1],[10,10,0,1]]]]);

    this.resetButton = new MyCube(this.scene,[2,1,2]);
    this.resetButton.setTexScale([this.scene.graph.textures["reset"][1],this.scene.graph.textures["reset"][2]]);

    this.replayButton = new MyCube(this.scene,[2,1,2]);
    this.replayButton.setTexScale([this.scene.graph.textures["replay"][1],this.scene.graph.textures["replay"][2]]); //TODO - texture coords

    this.gameWon = new MyCube(this.scene,[2,1,2]);
    this.gameWon.setTexScale([this.scene.graph.textures["blacksWon"][1],this.scene.graph.textures["blacksWon"][2]]);

    this.undoButton = new MyCube(this.scene,[2,1,2]);
    this.undoButton.setTexScale([this.scene.graph.textures["undo"][1],this.scene.graph.textures["undo"][2]]);

    this.illegalMove = new MyCube(this.scene,[2,1,2]);
    this.illegalMove.setTexScale([this.scene.graph.textures["invalidMove"][1],this.scene.graph.textures["invalidMove"][2]]);

    this.piecePool = new MyPiecePool(this.scene,this.game);
}

MyTabuleiro.prototype.resetGraphics = function() {
    this.pieces = [];
    this.ongoingAnimations = [];
    this.nextMove = [-1,-1,-1];
    this.showIllegalMove = false;
    this.state = "WAITING_FOR_PIECE";
    this.timeLeft = MAX_TIME_LEFT;
}

MyTabuleiro.prototype.setCurrentScores = function() {
    this.scene.whiteScore = this.game.getCurrentEaten(BLACKS);
    this.scene.blackScore = this.game.getCurrentEaten(WHITES);
}

/* 
   0 - 3 = Tipo de Peça
   0 - 25 = Coordenadas do tabuleiro
   30/31 = Reset/Undo
   40 = Replay
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
                        this.resetGraphics();
                        this.game.reset();
                    }else if(index == 31){ //Undo
                        this.resetGraphics();
                        this.game.undo();
                    }else if(index == 40){ //Replay
                        this.resetGraphics();
                        this.game.startReplay();
                    }else if(this.state == "WAITING_FOR_PIECE") {
                        this.nextMove[2] = index;
                        this.state = "WAITING_FOR_POS";
                    }else if(this.state == "WAITING_FOR_POS") {
                        this.nextMove[0] = (index%5);
                        this.nextMove[1] = 4-Math.floor(index/5);

                        this.game.requestMove(this.nextMove[0], this.nextMove[1], this.nextMove[2], this.game.getCurrentPlayerType());
                        
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

    if (!this.scene.pickMode && !this.scene.debug){
        this.processPicks();
    
        this.scene.clearPickRegistration();

        this.setCurrentScores();

        this.fullDisplay();
    }

    if (this.scene.pickMode || this.scene.debug){
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
        var ctrl_point_3 = [0,0,3];
        var ctrl_point_4 = [0,0,0.5];

        if(removedPieces[i][2] == BLACK_PIECE){
            ctrl_point_3[0] = -2;
            ctrl_point_3[1] = 3;
            ctrl_point_4[0] = -2;
            ctrl_point_4[1] = 3;
        }else if(removedPieces[i][2] == WHITE_PIECE){
            ctrl_point_3[0] = 7;
            ctrl_point_3[1] = 3;
            ctrl_point_4[0] = 7;
            ctrl_point_4[1] = 3;
        }

        var anim = new MyBezierAnimation([ctrl_point_1,ctrl_point_2,ctrl_point_3,ctrl_point_4],3);
        var ref = [removedPieces[i][0],removedPieces[i][1],removedPieces[i][2]];

        this.ongoingAnimations.push([ref,anim]);
    }
}

MyTabuleiro.prototype.updateAnim = function (currTime){
    if(this.previousTime != 0){
        this.timeLeft -= (currTime - this.previousTime)/1000;
    }

    this.scene.timeLeft = this.timeLeft;

    for(var i = 0; i < this.ongoingAnimations.length; i++){
        this.ongoingAnimations[i][1].update(currTime);
    }

    if(this.animating && this.scene.fixedCamera){
        if(this.count >= 200){
            this.state = "WAITING_FOR_PIECE";
            this.timeLeft = MAX_TIME_LEFT;
            this.animating = false;
            this.count = 0;
            this.fixCamera(this.game.getCurrentPlayerNo());
        }

        var delta = (currTime - this.previousTime)/12;
        this.count += 1 * delta;
        this.scene.camera.orbit(vec3.fromValues(0,0,0),Math.PI/200 * delta);
    }
    this.previousTime = currTime;
}

MyTabuleiro.prototype.buttonDisplay = function (pickMode){
    var currentPlayer = this.game.getCurrentPlayerNo();

    if(this.state == "GAME_ENDED"){
        if(!pickMode){
                this.scene.pushMatrix();
                this.scene.rotate(Math.PI/2,1,0,0);

                if (currentPlayer == WHITES && (this.game.getCurrentPlayerType() == HUMAN_PLAYER || this.state == "GAME_ENDED")) {
                    this.scene.translate(7,0,-1.3);
                }else if(currentPlayer == BLACKS && (this.game.getCurrentPlayerType() == HUMAN_PLAYER || this.state == "GAME_ENDED")){
                    this.scene.translate(-2,0,-3.7);
                    this.scene.rotate(Math.PI,0,1,0);
                }   

                if(this.game.winner == WHITES){
                    this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["whitesWon"][0]);
                }else if(this.game.winner == BLACKS){
                    this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["blacksWon"][0]);
                }else if(this.game.winner == TIE){
                    this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["tie"][0]);
                }
            
                this.scene.graph.materials["PIECE_MATERIAL"].apply();
    
                this.scene.rotate(Math.PI/2,0,1,0);

                this.gameWon.display();
            this.scene.popMatrix();
        }
        

        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2,1,0,0);

            if (currentPlayer == WHITES && (this.game.getCurrentPlayerType() == HUMAN_PLAYER || this.state == "GAME_ENDED")) {
                this.scene.translate(7,0,-3.7);
            }else if(currentPlayer == BLACKS && (this.game.getCurrentPlayerType() == HUMAN_PLAYER || this.state == "GAME_ENDED")){
                this.scene.translate(-2,0,-1.3);
                this.scene.rotate(Math.PI,0,1,0);
            }

            if(!pickMode){
                this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["replay"][0]);
                this.scene.graph.materials["PIECE_MATERIAL"].apply();
            }
    
            this.scene.rotate(Math.PI/2,0,1,0);

            if(pickMode) this.scene.registerForPick(40, this.replayButton);

            this.replayButton.display();
        this.scene.popMatrix();
    }

    this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,1,0,0);

        if (currentPlayer == WHITES && (this.game.getCurrentPlayerType() == HUMAN_PLAYER || this.state == "GAME_ENDED")) {
            this.scene.translate(7,0,1.3);
        }else if(currentPlayer == BLACKS && (this.game.getCurrentPlayerType() == HUMAN_PLAYER || this.state == "GAME_ENDED")){
            this.scene.translate(-2,0,-6.2);
            this.scene.rotate(Math.PI,0,1,0);
        }

        if(pickMode) this.scene.registerForPick(30, this.resetButton);

        if(!pickMode){
            this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["reset"][0]);
            this.scene.graph.materials["PIECE_MATERIAL"].apply();
        }

        this.scene.rotate(Math.PI/2,0,1,0);

        this.resetButton.display();
    this.scene.popMatrix();
    
    if(this.game.gameStates.length > 2){
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2,1,0,0);

            if (currentPlayer == WHITES && (this.game.getCurrentPlayerType() == HUMAN_PLAYER || this.state == "GAME_ENDED")) {
                this.scene.translate(7,0,-6.2);
            }else if(currentPlayer == BLACKS && (this.game.getCurrentPlayerType() == HUMAN_PLAYER || this.state == "GAME_ENDED")){
                this.scene.translate(-2,0,1.3);
                this.scene.rotate(Math.PI,0,1,0);
            }

            if(pickMode) this.scene.registerForPick(31, this.undoButton);
        
            if(!pickMode){
                this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["undo"][0]);
                this.scene.graph.materials["PIECE_MATERIAL"].apply();
            }
            
            this.scene.rotate(Math.PI/2,0,1,0);

            this.undoButton.display();
        this.scene.popMatrix();
    }

    if(this.showIllegalMove){
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2,1,0,0);

            if (currentPlayer == WHITES && (this.game.getCurrentPlayerType() == HUMAN_PLAYER || this.state == "GAME_ENDED")) {
                this.scene.translate(2.5,0,-6.2);
            }else if(currentPlayer == BLACKS && (this.game.getCurrentPlayerType() == HUMAN_PLAYER || this.state == "GAME_ENDED")){
                this.scene.translate(2.5,0,1.3);
                this.scene.rotate(Math.PI,0,1,0);
            }

            if(!pickMode){
                this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["invalidMove"][0]);
                this.scene.graph.materials["PIECE_MATERIAL"].apply();
            }

            this.scene.rotate(Math.PI/2,0,1,0);

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

    }else if(this.state == "GAME_ENDED"){
        this.buttonDisplay(true);
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
    if(playerNo == WHITES && this.scene.fixedCamera){
        this.scene.camera.setPosition(vec3.fromValues(4,18,0));
        this.scene.camera.setTarget(vec3.fromValues(0,3,0));
    }else if (playerNo == BLACKS && this.scene.fixedCamera){
        this.scene.camera.setPosition(vec3.fromValues(-4,18,0));
        this.scene.camera.setTarget(vec3.fromValues(0,3,0));
    }
}

MyTabuleiro.prototype.fullDisplay = function (){

    if(((this.state == "WAITING_FOR_PIECE" || this.state == "WAITING_FOR_POS") && this.game.getCurrentPlayerType() != HUMAN_PLAYER) || this.timeLeft <= 0){
        this.state = "WAITING_FOR_GAME";
        var playerType = this.game.getCurrentPlayerType();
        if (playerType == HUMAN_PLAYER){
            playerType = HARD_CPU_PLAYER;
        }
        this.game.requestMove("_", "_", "_", playerType);
        this.timeLeft = MAX_TIME_LEFT;
    }
    
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
        this.timeLeft = MAX_TIME_LEFT;
        this.fullBoardDisplay();
        this.pieceChoosingDisplay(this.game.getCurrentPlayerNo(), false);
        this.fixCamera(this.game.getCurrentPlayerNo());
    }else if(this.state == "DO_MOVE"){
        this.timeLeft = MAX_TIME_LEFT;
        this.showIllegalMove = false;
        this.fullBoardDisplay();
        this.fixCamera(1-this.game.getCurrentPlayerNo());
        if(this.ongoingAnimations.length == 0){
            this.state = "MOVING_CAMERA";
            this.animating = true;
        }
    }else if(this.state == "MOVING_CAMERA"){
        this.timeLeft = MAX_TIME_LEFT;
        this.fullBoardDisplay();
        this.pieceChoosingDisplay(this.game.getCurrentPlayerNo(), false);

        if (this.scene.fixedCamera){
            this.animating = true;
        }else{
            this.animating = false;
            this.count = 0;
            this.state = "WAITING_FOR_PIECE";
            this.timeLeft = MAX_TIME_LEFT;
        }
    }else if(this.state == "GAME_ENDED"){
        this.timeLeft = MAX_TIME_LEFT;
        this.fullBoardDisplay();
        this.buttonDisplay(false);
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
            if (pickMode) {piece = this.piecePool.getPiece(BOUNDING_BOX_PIECE);}
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
            if (pickMode) {piece = this.piecePool.getPiece(BOUNDING_BOX_PIECE);}
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
            if (pickMode) {piece = this.piecePool.getPiece(BOUNDING_BOX_PIECE);}
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
            if (pickMode) {piece = this.piecePool.getPiece(BOUNDING_BOX_PIECE);}
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
    this.scene.pushMatrix();
        this.scene.graph.materials["BOARD_MATERIAL"].setTexture(this.scene.graph.textures["boardFull"][0]);
        this.scene.graph.materials["BOARD_MATERIAL"].apply();

        this.scene.rotate(Math.PI/2, 0,0,1);
        this.scene.scale(0.585,0.585,0);
        this.scene.translate(-0.755,-9.245,0);

        this.board.display();
    this.scene.popMatrix();

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
