/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks, inside = false) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.inside = inside;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 	
	var z = 0;
	var y = 0;
	var x = 0;

	var currentAngle = 0;

	this.vertices = [];
	this.normals = [];
	this.indices = [];

	this.texCoords = [];

	var low = 0;
	var high = 0;
	var step = 1/this.stacks;


	var xtext = 0;
	var ytext = 1;

	var yTextInc = 1/this.stacks;
	var xTextInc = 1/this.slices;

	for (var j = 0; j < this.stacks; j++){
		
		xtext = 0;

		for (var i = 0; i < this.slices; i++){ //Atencao! A colocacao de vertices nao é 1 2 3 4 mas sim 1 3 5 7
			this.texCoords.push(xtext,ytext);  //     									5 6 7 8         2 4 6 8
			this.texCoords.push(xtext,ytext-yTextInc);
			xtext += xTextInc;
		}

		ytext -= yTextInc;
	}

	/*
	this.vertices.push(0,0,1); //Colocacao de um vertice no centro para a criacao da tampa
	this.normals.push(0,0,1);*/


	for(var j = 0; j < this.stacks && !this.inside; j++){
		low = high;
		high += step;
		currentAngle = 0;

		for (var i = 0; i < this.slices; i++) {
			z = 0;

			x = Math.sin(currentAngle);
			y = Math.cos(currentAngle);

			this.vertices.push(x, y, low); //Bottom 0
			this.vertices.push(x, y, high); //Top 1
			
			this.normals.push(x, y, 0); //Bottom 
			this.normals.push(x, y, 0); //Bottom 

			currentAngle += ((Math.PI * 2) / this.slices);
			x = Math.sin(currentAngle);
			y = Math.cos(currentAngle);

			if(i != this.slices-1){
				this.indices.push(0 + ((i * 2) + (j*2*this.slices)), 1 + ((i * 2) + (j*2*this.slices)), 2 + ((i * 2) + (j*2*this.slices)));
				this.indices.push(1 + ((i * 2) + (j*2*this.slices)), 3 + ((i * 2) + (j*2*this.slices)), 2 + ((i * 2) + (j*2*this.slices)));
			}else{ //Caso seja a ultima face, os vertices têm de conectar com os vertices da primeira.
				this.indices.push(0 + ((i * 2) + (j*2*this.slices)), 1 + ((i * 2) + (j*2*this.slices)), 0 + (j*2*this.slices));
				this.indices.push(1 + ((i * 2) + (j*2*this.slices)), 1 + (j*2*this.slices), 0 + (j*2*this.slices));
			}

		}

	}

	for(var j = 0; j < this.stacks && this.inside; j++){
		low = high;
		high += step;
		currentAngle = 0;

		for (var i = 0; i < this.slices; i++) {
			z = 0;

			x = Math.sin(currentAngle);
			y = Math.cos(currentAngle);

			this.vertices.push(x, y, low); //Bottom 0
			this.vertices.push(x, y, high); //Top 1
			
			this.normals.push(-x, -y, 0); //Bottom 
			this.normals.push(-x, -y, 0); //Bottom 

			currentAngle += ((Math.PI * 2) / this.slices);
			x = Math.sin(currentAngle);
			y = Math.cos(currentAngle);

			if(i != this.slices-1){
				this.indices.push(1 + ((i * 2) + (j*2*this.slices)), 0 + ((i * 2) + (j*2*this.slices)), 2 + ((i * 2) + (j*2*this.slices)));
				this.indices.push(3 + ((i * 2) + (j*2*this.slices)), 1 + ((i * 2) + (j*2*this.slices)), 2 + ((i * 2) + (j*2*this.slices)));
			}else{ //Caso seja a ultima face, os vertices têm de conectar com os vertices da primeira.
				this.indices.push(1 + ((i * 2) + (j*2*this.slices)), 0 + ((i * 2) + (j*2*this.slices)), 0 + (j*2*this.slices));
				this.indices.push(1 + (j*2*this.slices), 1 + ((i * 2) + (j*2*this.slices)), 0 + (j*2*this.slices));
			}

		}

	}

	
	/*
	for(var i = 0; i < (this.slices*2)-2; i += 2){ //Criacao de uma tampa
		this.indices.push(0, 4 + i + (this.slices * 2 * (this.stacks-1)), 2 + i + (this.slices * 2 * (this.stacks-1)));
	}
	this.indices.push(0,2,this.slices*2); //Ultimo triangulo => (centro, primeiro vertice, ultimo vertice)	*/

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
