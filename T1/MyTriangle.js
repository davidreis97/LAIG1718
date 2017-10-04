/**
 * MyTriangle
 * @constructor
 */
function MyTriangle(scene, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z) {
	CGFobject.call(this,scene);
	
	this.v1x = v1x;
	this.v1y = v1y;
	this.v1z = v1z;
	this.v2x = v2x;
	this.v2y = v2y;
	this.v2z = v2z;
	this.v3x = v3x;
	this.v3y = v3y;
	this.v3z = v3z;

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
    
    var a = Math.sqrt(Math.pow(this.v1x-this.v3x, 2) + Math.pow(this.v1y-this.v3y, 2) + Math.pow(this.v1z-this.v3z, 2));
	var b = Math.sqrt(Math.pow(this.v2x-this.v1x, 2) + Math.pow(this.v2y-this.v1y, 2) + Math.pow(this.v2z-this.v1z, 2));
    var c = Math.sqrt(Math.pow(this.v3x-this.v2x, 2) + Math.pow(this.v3y-this.v2y, 2) + Math.pow(this.v3z-this.v2z, 2));
    var beta = Math.acos((Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2))/(2*a*c));
    
    this.texCoords = [
		0, 0,
		1, 0,
		(c - a*Math.cos(beta))/c, a*Math.sin(beta)/c
    ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

/**
 * Updates the Triangle amplification factors
 * @param amplif_s s domain amplification factor
 * @param amplif_t t domain amplification factor
 */
MyTriangle.prototype.setAmplifFactor = function(ampS, ampT) {
    
    var a = Math.sqrt(Math.pow(this.v1x-this.v3x, 2) + Math.pow(this.v1y-this.v3y, 2) + Math.pow(this.v1z-this.v3z, 2));
	var b = Math.sqrt(Math.pow(this.v2x-this.v1x, 2) + Math.pow(this.v2y-this.v1y, 2) + Math.pow(this.v2z-this.v1z, 2));
    var c = Math.sqrt(Math.pow(this.v3x-this.v2x, 2) + Math.pow(this.v3y-this.v2y, 2) + Math.pow(this.v3z-this.v2z, 2));
    var beta = Math.acos((Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2))/(2*a*c));
    
    this.texCoords = [
		0, 0,
		1, 0,
		(c - a*Math.cos(beta))/c*c/ampS, a*Math.sin(beta)/c*c/ampT
    ];	
	
	this.updateTexCoordsGLBuffers();
}
