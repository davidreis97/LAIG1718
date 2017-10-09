/**
 * MyRectangle
 * @constructor
 */
function MyRectangle(scene, args, tex_scale_values) {
    CGFobject.call(this, scene);

    this.minX = args[0];
    this.maxY = args[1];
    this.maxX = args[2];
    this.minY = args[3];

    this.ampS = tex_scale_values[0];
    this.ampT = tex_scale_values[1];

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
    this.normals.push(0, 0, 1);

    this.vertices.push(this.minX, this.maxY, 0);
    this.normals.push(0, 0, 1);

    this.vertices.push(this.maxX, this.maxY, 0);
    this.normals.push(0, 0, 1);

    this.vertices.push(this.maxX, this.minY, 0);
    this.normals.push(0, 0, 1);

    this.indices = [0,2,1,
                    0,3,2];

    var s = (this.maxX - this.minX)/this.ampS;
    var t = (this.maxY - this.minY)/this.ampT;

    this.texCoords.push(0,t);
    this.texCoords.push(0,0);
    this.texCoords.push(s,0);
    this.texCoords.push(s,t);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}