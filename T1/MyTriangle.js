/**
 * MyTriangle
 * @constructor
 */
function MyTriangle(scene, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z) {
	GFobject.call(this,scene);
	
	this.v1x = v1x;
	this.v1y = v1y;
	this.v1z = v1z;
	this.v2x = v2x;
	this.v2y = v2y;
	this.v2z = v2z;
	this.v3x = v3x;
	this.v3y = v3y;
	this.v3z = v3z;
	
	this.minS = 0;
	this.minT = 0;
	this.maxS = 1;
	this.maxT = 1;

	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

/**
 * Initializes the Triangle buffers (vertices, indices, normals and texCoords)
 */
MyTriangle.prototype.initBuffers = function () {
	this.vertices = [
        this.v1x, this.v1y, this.v1z,
        this.v2x, this.v2y, this.v2z,
        this.v3x, this.v3y, this.v3z
	];

	this.indices = [ 0, 1, 2 ];


    this.normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1 ];
    
    var ab = Math.sqrt(Math.pow(this.v2x-this.v1x, 2) + Math.pow(this.v2y-this.v1y, 2) + Math.pow(this.v2z-this.v1z, 2));
    var bc = Math.sqrt(Math.pow(this.v2x-this.v3x, 2) + Math.pow(this.v2y-this.v3y, 2) + Math.pow(this.v2z-this.v3z, 2));
    var ac = Math.sqrt(Math.pow(this.v1x-this.v3x, 2) + Math.pow(this.v1y-this.v3y, 2) + Math.pow(this.v1z-this.v3z, 2));
    var alpha = Math.acos((Math.pow(bc, 2) + Math.pow(ab, 2) - Math.pow(ac, 2))/(2*ab*bc));
    
    this.texCoords = [
		this.minS, this.minT,
		this.maxS, this.minT,
		(ab - bc*Math.cos(alpha))/ab, bc*Math.sin(alpha)/ab
    ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyTriangle.prototype.setAmpFactor = function(ampS,ampT){
    var ab = Math.sqrt(Math.pow(this.v2x-this.v1x, 2) + Math.pow(this.v2y-this.v1y, 2) + Math.pow(this.v2z-this.v1z, 2));
    var bc = Math.sqrt(Math.pow(this.v2x-this.v3x, 2) + Math.pow(this.v2y-this.v3y, 2) + Math.pow(this.v2z-this.v3z, 2));
    var ac = Math.sqrt(Math.pow(this.v1x-this.v3x, 2) + Math.pow(this.v1y-this.v3y, 2) + Math.pow(this.v1z-this.v3z, 2));
    var beta = Math.acos((Math.pow(bc, 2) + Math.pow(ab, 2) - Math.pow(ac, 2))/(2*ab*bc));
    
    this.texCoords = [
		this.minS, this.minT,
		this.maxS, this.minT*ab/ampS,
		((ab - bc*Math.cos(alpha))/ab)*ab/ampS, (bc*Math.sin(alpha)/ab)*ab/ampT
    ];	
	
	this.updateTexCoordsGLBuffers();

    
}