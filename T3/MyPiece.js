/**
 * MyPiece
 * @constructor
 */

function MyPiece(scene, type, pos) {
    CGFobject.call(this, scene);

    this.type = type;

    this.pos = pos;

    this.initBuffers();
};

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

MyPiece.prototype.initBuffers = function () {
    this.primitive = new MyCylinder(this.scene,[1,0.5,0.5,10,10,1,1]);
}

MyPiece.prototype.display = function (){
    this.scene.pushMatrix();
        switch(this.type){
            case WHITE_PIECE:
                this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["WHITE_PIECE"][0]);
                this.scene.graph.materials["PIECE_MATERIAL"].apply();
                break;
            case BLACK_PIECE:
                this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["BLACK_PIECE"][0]);
                this.scene.graph.materials["PIECE_MATERIAL"].apply();
                break;
            case HENGE_PIECE:
                this.scene.graph.materials["PIECE_MATERIAL"].setTexture(this.scene.graph.textures["HENGE_PIECE"][0]);
                this.scene.graph.materials["PIECE_MATERIAL"].apply();
                break;
            default:
                break;
        }
        this.scene.translate(this.pos[0]+0.5,this.pos[1]+0.5,0);
        this.primitive.display();
    this.scene.popMatrix();
}

MyPiece.prototype.miniDisplay = function (playerNo){
    console.log("Displaying optimized towards player " + playerNo);
}