/**
 * MyPrism
 * @constructor
 */
 function MyPrism(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MyPrism.prototype = Object.create(CGFobject.prototype);
 MyPrism.prototype.constructor = MyPrism;

 MyPrism.prototype.initBuffers = function() {
 	
	var z = 0;
	var y = 0;
	var x = 0;

	var currentAngle = 0;

	this.vertices = [];
	this.normals = [];
	this.indices = [];

	var low = 0;
	var high = 0;
	var step = 1/this.stacks;

	for(var j = 0; j < this.stacks; j++){
		low = high;
		high += step;
		currentAngle = 0;
		for (var i = 0; i < this.slices; i++) {
			z = 0;

			x = Math.sin(currentAngle);
			y = Math.cos(currentAngle);

			this.vertices.push(x, y, low); //Bottom 0
			this.vertices.push(x, y, high); //Top 1

			currentAngle += ((Math.PI * 2) / this.slices) / 2;
			x = Math.sin(currentAngle);
			y = Math.cos(currentAngle);

			this.normals.push(x, y, 0); //Bottom 
			this.normals.push(x, y, 0); //Bottom 
			this.normals.push(x, y, 0); //Top
			this.normals.push(x, y, 0); //Top

			currentAngle += (Math.PI * 2 / this.slices) / 2;
			x = Math.sin(currentAngle);
			y = Math.cos(currentAngle);

			this.vertices.push(x, y, low); //Bottom 2
			this.vertices.push(x, y, high); //Top 3

			this.indices.push(0 + ((i * 4) + (j*4*this.slices)), 1 + ((i * 4) + (j*4*this.slices)), 2 + ((i * 4) + (j*4*this.slices)));
			this.indices.push(1 + ((i * 4) + (j*4*this.slices)), 3 + ((i * 4) + (j*4*this.slices)), 2 + ((i * 4) + (j*4*this.slices)));

		}
	}
	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
