/**
 * MyLamp
 * @constructor
 */
function MyLamp(scene, slices, stacks) {
	CGFobject.call(this, scene);

	this.slices = slices;
	this.stacks = stacks;

	this.initBuffers();
};

MyLamp.prototype = Object.create(CGFobject.prototype);
MyLamp.prototype.constructor = MyLamp;

MyLamp.prototype.initBuffers = function () {

	var z = 0;
	var y = 0;
	var x = 0;

	var currentAngle = 0;

	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords = [];

	var theta = 0;
	var phi = 0;

	var phiInc = (Math.PI*2/4)/this.stacks;
	var thetaInc = (Math.PI*2)/this.slices;

	for (var j = 0; j < this.stacks; j++)  { 
		theta = 0;
		for(var i = 0; i < this.slices; i++) {
			x = Math.cos(phi) * Math.cos(theta);
			y = Math.cos(phi) * Math.sin(theta);
			z = Math.sin(phi);

			this.vertices.push(x,y,z);
			this.normals.push(x,y,z);
			this.texCoords.push(1,1);

			x = Math.cos(phi+phiInc) * Math.cos(theta);
			y = Math.cos(phi+phiInc) * Math.sin(theta);
			z = Math.sin(phi+phiInc);

			this.vertices.push(x,y,z);
			this.normals.push(x,y,z);
			this.texCoords.push(-1,1);

			x = Math.cos(phi) * Math.cos(theta + thetaInc);
			y = Math.cos(phi) * Math.sin(theta + thetaInc);
			z = Math.sin(phi);

			this.vertices.push(x,y,z);
			this.normals.push(x,y,z);
			this.texCoords.push(1,-1);

			x = Math.cos(phi+phiInc) * Math.cos(theta + thetaInc);
			y = Math.cos(phi+phiInc) * Math.sin(theta + thetaInc);
			z = Math.sin(phi+phiInc);
			
			this.vertices.push(x,y,z);
			this.normals.push(x,y,z);
			this.texCoords.push(-1,-1);

			this.indices.push(0 + (i*4) + (j*this.slices*4), 2 + (i*4) + (j*this.slices*4), 1 + (i*4) + (j*this.slices*4));
			this.indices.push(1 + (i*4) + (j*this.slices*4), 2 + (i*4) + (j*this.slices*4), 3 + (i*4) + (j*this.slices*4));

			theta += thetaInc;
		}
		phi += phiInc;
	}


	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
