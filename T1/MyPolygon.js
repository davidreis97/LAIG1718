/**
 * MyPolygon
 * @constructor
 */
 function MyPolygon(scene, slices = 4) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;

 	this.initBuffers();
 };

 MyPolygon.prototype = Object.create(CGFobject.prototype);
 MyPolygon.prototype.constructor = MyPolygon;

 MyPolygon.prototype.initBuffers = function() {
 	this.vertices = [];
 	this.normals = [];
 	this.texCoords = [];
 	this.indices = [];

 	this.vertices.push(0,0,1);
 	this.texCoords.push(0.5, 0.5);
 	this.normals.push(0,0,1);

 	var angulo = 0;

 	for(var j = 0; j < this.slices+1; j++){
 		x = Math.cos(angulo);
 		y = Math.sin(angulo);

 		angulo += Math.PI*2/(this.slices);

 		this.vertices.push(x,y,1);
 		this.texCoords.push(0.5 + x*0.5, 0.5 - y*0.5);
 		this.normals.push(0,0,1);
 		
 		this.indices.push(0, j, j+1);
 	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
}
