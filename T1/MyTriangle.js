/**
 * MyTriangle
 * @constructor
 */
function MyTriangle(scene, args, tex_scale_values) {
	CGFobject.call(this,scene);

	this.v1 = [args[0], args[1], args[2]];
	this.v2 = [args[3], args[4], args[5]];
	this.v3 = [args[6], args[7], args[8]];

	this.ampS = tex_scale_values[0];
    this.ampT = tex_scale_values[1];

	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function () {
	var x = 0; //Used to make more readable the vertex arrays
	var y = 1;
	var z = 2;

	this.vertices = [];                            
    this.normals = [];                      
    this.texCoords = [];
	this.indices = [];
	
	this.vertices = this.vertices.concat(this.v1);
	this.vertices = this.vertices.concat(this.v2);
	this.vertices = this.vertices.concat(this.v3);

	this.normals = [
		0,0,1,
		0,0,1,
		0,0,1
	];

	this.texCoords.push(0,0);
	
	var difX = (this.v2[x] - this.v1[x]);
    var difY = (this.v2[y] - this.v1[y]);

	var s = difX/this.ampS;
	var t = difY/this.ampT;
	
	this.texCoords.push(s,-t);
	
	var difX = (this.v3[x] - this.v1[x]);
    var difY = (this.v3[y] - this.v1[y]);

	var s = difX/this.ampS;
	var t = difY/this.ampT;
	
    this.texCoords.push(s,-t);

	this.indices.push(0,2,1);

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};