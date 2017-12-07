/**
 * MyRectangle
 * @constructor
 */
function MyRectangle(scene, args) {
    CGFobject.call(this, scene);

    this.args = args;

    this.minX = args[0];
    this.maxY = args[1];
    this.maxX = args[2];
    this.minY = args[3];

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
    this.indices = [];

    this.vertices.push(this.minX, this.maxY, 0);
    this.vertices.push(this.minX, this.minY, 0);
    this.vertices.push(this.maxX, this.minY, 0);
    this.vertices.push(this.maxX, this.maxY, 0);

    this.normals.push(0, 0, 1);
    this.normals.push(0, 0, 1);
    this.normals.push(0, 0, 1);
    this.normals.push(0, 0, 1);

    this.indices = [0,1,2,
                    0,2,3];

    this.setTexScale([1,1]);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}

MyRectangle.prototype.setTexScale = function (tex_scale_factor){
    this.texCoords = [];

    var difX = (this.maxX - this.minX);
    var difY = (this.maxY - this.minY);


    var s = difX/tex_scale_factor[0];
    var t = difY/tex_scale_factor[1];

    this.texCoords.push(0,0);
    this.texCoords.push(0,t);
    this.texCoords.push(s,t);
    this.texCoords.push(s,0);

    this.updateTexCoordsGLBuffers();
}
