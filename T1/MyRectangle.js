/**
 * MyRectangle
 * @constructor
 */
function MyRectangle(scene, width, height) {
    CGFobject.call(this, scene);

    this.width = width;
    this.height = height;

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

MyRectangle.prototype.initBuffers = function () {
    this.vertices = [];                            
    this.normals = [];                      
    this.texCoords = [];
    this.indices = [];

    this.vertices.push(-this.width/2, -this.height/2, 0);
    this.texCoords.push(0, 0);
    this.normals.push(0, 0, 1);

    this.vertices.push(-this.width/2, this.height/2, 0);
    this.texCoords.push(0, 1);
    this.normals.push(0, 0, 1);

    this.vertices.push(this.width/2, this.height/2, 0);
    this.texCoords.push(1, 1);
    this.normals.push(0, 0, 1);

    this.vertices.push(this.width/2, -this.height/2, 0);
    this.texCoords.push(1, 0);
    this.normals.push(0, 0, 1);

    this.indices = [0,2,1,
                    0,3,2];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
