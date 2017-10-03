/**
 * MyRectangle
 * @constructor
 */
function MyRectangle(scene, leftTopX, leftTopY, bottomRightX, bottomRightY) {
    CGFobject.call(this, scene);

    this.minX = leftTopX;
    this.maxX = bottomRightX;
    this.minY = bottomRightY;
    this.maxY = leftTopY;

    this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

/*  x is width, y is height 

    1------2
    |      |
    |      | 
    0------3
*/

//Sets default texCoords
MyRectangle.prototype.initBuffers = function () {
    this.vertices = [];                            
    this.normals = [];                      
    this.texCoords = [];
    this.indices = [];

    this.vertices.push(this.minX, this.minY, 0);
    this.texCoords.push(0, 0);
    this.normals.push(0, 0, 1);

    this.vertices.push(this.minX, this.maxY, 0);
    this.texCoords.push(0, 1);
    this.normals.push(0, 0, 1);

    this.vertices.push(this.maxX, this.maxY, 0);
    this.texCoords.push(1, 1);
    this.normals.push(0, 0, 1);

    this.vertices.push(this.maxX, this.minY, 0);
    this.texCoords.push(1, 0);
    this.normals.push(0, 0, 1);

    this.indices = [0,2,1,
                    0,3,2];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}

MyRectangle.prototype.setAmpFactor = function(ampS,ampT){
    this.texCoords = [];

    var s = (this.maxX - this.minX)/ampS;
    var t = (this.maxY - this.minY)/ampT;

    this.texCoords.push(0,0);
    this.texCoords.push(0,t);
    this.texCoords.push(s,t);
    this.texCoords.push(s,0);
}
