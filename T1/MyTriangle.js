/**
 * MyTriangle
 * @constructor
 */
function MyTriangle(scene, args, tex_scale_values) {
	CGFobject.call(this,scene);

	this.v2 = [args[3], args[4], args[5]];
	this.v1 = [args[0], args[1], args[2]];
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

	this.indices = [0,2,1];

	var distA = Math.sqrt(Math.pow(this.v1[x] - this.v3[x],2) + Math.pow(this.v1[y] - this.v3[y],2) + Math.pow(this.v1[z] - this.v3[z],2));
	var distB = Math.sqrt(Math.pow(this.v2[x] - this.v1[x],2) + Math.pow(this.v2[y] - this.v1[y],2) + Math.pow(this.v2[z] - this.v1[z],2));
	var distC = Math.sqrt(Math.pow(this.v3[x] - this.v2[x],2) + Math.pow(this.v3[y] - this.v2[y],2) + Math.pow(this.v3[z] - this.v2[z],2));
	
	var angA = Math.acos((-(distA*distA) + (distB*distB) + (distC*distC))/(2*distB*distC));
	var angY = Math.acos(((distA*distA) + (distB*distB) - (distC*distC))/(2*distA*distB));
	var angB = Math.acos(((distA*distA) - (distB*distB) + (distC*distC))/(2*distA*distC));
	
	this.texCoords.push(distC - distA*Math.cos(angB), distA*Math.sin(angB));	
	this.texCoords.push(0,0);
	this.texCoords.push(distC,0);

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};