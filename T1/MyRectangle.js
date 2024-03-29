/**
 * MyRectangle
 * @constructor
 */
function MyRectangle(scene, args) {
    CGFobject.call(this, scene);

    this.args = args;

    if(args.length == 4){ //For rectangles created through default LMX definition
        this.minX = args[0];
        this.maxY = args[1];
        this.maxX = args[2];
        this.minY = args[3];
        this.minZ = 0;
        this.maxZ = 0;
    }else if(args.length == 6){ //For rectangles created through our primitive MyCube
        this.minX = args[0];
        this.minY = args[1];
        this.minZ = args[2];
        this.maxX = args[3];
        this.maxY = args[4];
        this.maxZ = args[5];
    }

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


    //TODO - If rectangles are displayed in the wrong place/orientation, this is probably what's wrong

    if(this.minX == this.maxX){
        this.vertices.push(this.minX, this.maxY, this.minZ);
        this.vertices.push(this.minX, this.minY, this.minZ);
        this.vertices.push(this.minX, this.minY, this.maxZ);
        this.vertices.push(this.minX, this.maxY, this.maxZ);
    }
    else{
        this.vertices.push(this.minX, this.minY, this.minZ); //1

        this.vertices.push(this.minX, this.maxY, this.maxZ); //2

        this.vertices.push(this.maxX, this.maxY, this.maxZ); //3

        this.vertices.push(this.maxX, this.minY, this.minZ); //4
    }

    if(this.args.length == 4){
        if(this.minX == this.maxX){
            this.normals.push(-1, 0, 0);
            this.normals.push(-1, 0, 0);
            this.normals.push(-1, 0, 0);
            this.normals.push(-1, 0, 0);
        }
        if(this.minY == this.maxY){
            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);
        }
        if(this.minZ == this.maxZ){
            this.normals.push(0, 0, -1);
            this.normals.push(0, 0, -1);
            this.normals.push(0, 0, -1);
            this.normals.push(0, 0, -1);
        }

    }else{
        if(this.minX == this.maxX && ((this.minY > this.maxY) || (this.minZ > this.maxZ))){
            this.normals.push(-1, 0, 0);
            this.normals.push(-1, 0, 0);
            this.normals.push(-1, 0, 0);
            this.normals.push(-1, 0, 0);
         }else if(this.minX == this.maxX){
            this.normals.push(1, 0, 0);
            this.normals.push(1, 0, 0);
            this.normals.push(1, 0, 0);
            this.normals.push(1, 0, 0);
        }
        
        if(this.minY == this.maxY && ((this.minY < this.maxY) || (this.minZ < this.maxZ))){
            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);
        }else if(this.minY == this.maxY){
            this.normals.push(0, 1, 0);
            this.normals.push(0, 1, 0);
            this.normals.push(0, 1, 0);
            this.normals.push(0, 1, 0);
        }

        if(this.minZ == this.maxZ && ((this.minY > this.maxY) || (this.minZ > this.maxZ))){
            this.normals.push(0, 0, -1);
            this.normals.push(0, 0, -1);
            this.normals.push(0, 0, -1);
            this.normals.push(0, 0, -1);
        }else if (this.minZ == this.maxZ){
            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);
        }
    }
    

    this.indices = [0,2,1,
                    0,3,2];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}

MyRectangle.prototype.setTexScaleFactor = function(tex_scale_factor){
    this.texCoords = [];

    var difX = (this.maxX - this.minX);
    var difY = (this.maxY - this.minY);
    var difZ = (this.maxZ - this.minZ);

    if(difX == 0){
        var s = difZ/tex_scale_factor[0];
        var t = difY/tex_scale_factor[1];
    }else if(difY == 0){
        var s = difX/tex_scale_factor[0];
        var t = difZ/tex_scale_factor[1];
    }else{
        var s = difX/tex_scale_factor[0];
        var t = difY/tex_scale_factor[1];
    }

    this.texCoords.push(0,0);
    this.texCoords.push(0,t);
    this.texCoords.push(s,t);
    this.texCoords.push(s,0);

    this.updateTexCoordsGLBuffers();
}
