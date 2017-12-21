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

  this.blacks = [];
  this.currentBlack = 0;

  this.henges = [];
  this.currentHenge = 0;
};

MyPiecePool.prototype.getPiece = function(pieceType) {
  switch (pieceType) {
    case WHITE_PIECE:
      if (this.currentWhite >= this.whites.length) {
        var piece = new MyPiece(this.scene, WHITE_PIECE);
        this.whites.push(piece);
      }
      this.currentWhite++;
      return this.whites[this.currentWhite - 1];
    case BLACK_PIECE:
      if (this.currentBlack >= this.blacks.length) {
        var piece = new MyPiece(this.scene, BLACK_PIECE);
        this.blacks.push(piece);
      }
      this.currentBlack++;
      return this.blacks[this.currentBlack - 1];
    case HENGE_PIECE:
      if (this.currentHenge >= this.henges.length) {
        var piece = new MyPiece(this.scene, HENGE_PIECE);
        this.henges.push(piece);
      }
      this.currentHenge++;
      return this.henges[this.currentHenge - 1];
    default:
      console.error("Unknown piece type: " + pieceType);
  }
};

MyPiecePool.prototype.reset = function() {
    this.currentBlack = 0;
    this.currentWhite = 0;
    this.currentHenge = 0;
};
