/**
 * MySphere
 * @constructor
 */
function MySphere(scene, args) {
	CGFobject.call(this, scene);

	this.radius = args[0];
	this.stacks = args[1];
	this.slices = args[2];

	this.initBuffers();
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function () {

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

	var phiInc = (Math.PI*2)/this.stacks;
	var thetaInc = (Math.PI*2)/this.slices;

	for (var j = 0; j < this.stacks; j++)  { 
		theta = 0;
		for(var i = 0; i < this.slices; i++) {
			x = Math.cos(phi) * Math.cos(theta)*this.radius;
			y = Math.cos(phi) * Math.sin(theta)*this.radius;
			z = Math.sin(phi)*this.radius;

			this.vertices.push(x,y,z);
			this.texCoords.push(1,1);
			this.normals.push(x,y,z);

			x = Math.cos(phi+phiInc) * Math.cos(theta)*this.radius;
			y = Math.cos(phi+phiInc) * Math.sin(theta)*this.radius;
			z = Math.sin(phi+phiInc)*this.radius;

			this.vertices.push(x,y,z);
			this.texCoords.push(-1,1);
			this.normals.push(x,y,z);

			x = Math.cos(phi) * Math.cos(theta + thetaInc)*this.radius;
			y = Math.cos(phi) * Math.sin(theta + thetaInc)*this.radius;
			z = Math.sin(phi)*this.radius;

			this.vertices.push(x,y,z);
			this.texCoords.push(1,-1);
			this.normals.push(x,y,z);

			x = Math.cos(phi+phiInc) * Math.cos(theta + thetaInc)*this.radius;
			y = Math.cos(phi+phiInc) * Math.sin(theta + thetaInc)*this.radius;
			z = Math.sin(phi+phiInc)*this.radius;
			
			this.vertices.push(x,y,z);
			this.normals.push(x,y,z);
			this.texCoords.push(-1,-1);

			this.indices.push(0 + (i*4) + (j*this.slices*4), 2 + (i*4) + (j*this.slices*4), 1 + (i*4) + (j*this.slices*4));
			this.indices.push(1 + (i*4) + (j*this.slices*4), 2 + (i*4) + (j*this.slices*4), 3 + (i*4) + (j*this.slices*4));

			theta+=thetaInc;
		}
		phi += phiInc;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
