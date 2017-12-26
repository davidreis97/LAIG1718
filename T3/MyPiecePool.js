/**
 * MyPiecePool
 * @constructor
 */

function MyPiecePool(scene) {
  CGFobject.call(this, scene);

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

MyPiecePool.prototype.getBoundingBox = function (){
  return this.getPiece(BLACK_PIECE);
} //TODO - Create bounding box pool for pieces

MyPiecePool.prototype.getPiece = function(pieceType) {
  if(this.whites.length > 100 || this.blacks.length > 100 || this.henges.length > 100){
    console.warn("Warning: Abnormally high number of pieces allocated in MyPiecePool");
    console.warn("Whites: " + this.whites.length + " Blacks: " + this.blacks.length + " Henges: " + this.henges.length);
  }

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
