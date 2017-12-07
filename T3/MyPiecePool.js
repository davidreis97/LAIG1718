/**
 * MyPiecePool
 * @constructor
 */

function MyPiecePool(scene, game) {
  CGFobject.call(this, scene);

  this.game = game;

  this.initBuffers();
}

MyPiecePool.prototype = Object.create(CGFobject.prototype);
MyPiecePool.prototype.constructor = MyPiecePool;

MyPiecePool.prototype.initBuffers = function() {
  this.whites = [];
  this.currentWhite = 0;

  for (var i = 0; i < this.game.pieceCount[0]; i++) {
    var piece = new MyPiece(this.scene, WHITE_PIECE);
    this.whites.push(piece);
  } 

  this.blacks = [];
  this.currentBlack = 0;

  for (var i = 0; i < this.game.pieceCount[2]; i++) {
    var piece = new MyPiece(this.scene, BLACK_PIECE);
    this.blacks.push(piece);
  }

  this.henges = [];
  this.currentHenge = 0;

  for (var i = 0; i < this.game.pieceCount[1] + this.game.pieceCount[3]; i++) {
    var piece = new MyPiece(this.scene, HENGE_PIECE);
    this.henges.push(piece);
  }
};

MyPiecePool.prototype.getPiece = function(pieceType) {
  switch (pieceType) {
    case WHITE_PIECE:
      if (this.currentWhite >= this.whites.size) {
        console.error("NOT ENOUGH WHITE PIECES IN PIECE POOL");
        return null;
      }
      return this.whites[this.currentWhite++];
    case BLACK_PIECE:
      if (this.currentBlack >= this.blacks.size) {
        console.error("NOT ENOUGH WHITE PIECES IN PIECE POOL");
        return null;
      }
      return this.blacks[this.currentBlack++];
    case HENGE_PIECE:
      if (this.currentHenge >= this.henges.size) {
        console.error("NOT ENOUGH HENGE PIECES IN PIECE POOL");
        return null;
      }
      return this.henges[this.currentHenge++];
    default:
      console.error("Unknown piece type: " + pieceType);
  }
};

MyPiecePool.prototype.reset = function() {
    this.currentBlack = 0;
    this.currentWhite = 0;
    this.currentHenge = 0;
};
