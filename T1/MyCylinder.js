/**
 * MyCylinder
 * @constructor
 */

var degToRad = Math.PI / 180.0;

//args: height, bottom_radius, top_radius, stacks, slices, top_cap, bottom_cap

function MyCylinder(scene, args) {
    CGFobject.call(this, scene);

    
    this.height = args[0];
	this.bottom_radius = args[1];
	this.top_radius = args[2];
	this.stacks = args[3];
	this.slices = args[4];

	if(args.length == 5){
		this.top_cap = 0;
		this.bottom_cap = 0;
	}

	if(args.length == 7){
		this.top_cap = args[5];
		this.bottom_cap = args[6];
	}

    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function () {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var radius_inc = (this.top_radius - this.bottom_radius)/this.stacks;

    var inc=2*Math.PI / (this.slices);



	//---------------vertices/normals--------------------

    for (var j= 0; j <= this.stacks; j++) {

        for (var i = 0; i < this.slices; i++) {
         
            this.vertices.push((this.bottom_radius + j*radius_inc) * Math.cos(i * inc), (this.bottom_radius + j*radius_inc) * Math.sin(i * inc), this.height * j / this.stacks);

            if(this.height>0){
            	var angle = Math.atan(Math.abs(this.top_radius-this.bottom_radius)/this.height);
            	this.normals.push(Math.cos(angle)*Math.cos(i*inc),
						Math.cos(angle)*Math.sin(i*inc),
						Math.sin(angle));
            }

        }
    }


	//--------------indices------------------------
    for (var j = 1; j <= this.stacks; j++) {

        this.indices.push(j*this.slices + this.slices - 1, j*this.slices - 1, j * this.slices - this.slices);
		this.indices.push(j*this.slices + this.slices - 1, j * this.slices - this.slices, j*this.slices);
        

        for (var i = 1; i < this.slices; i++) {

           this.indices.push(j * this.slices + i - 1, j * this.slices - this.slices + i - 1, j * this.slices - this.slices + i);
           this.indices.push(j * this.slices + i - 1, j * this.slices - this.slices + i, j * this.slices + i);

        }
    }

    var s = 0;
    var t = 0;
    var sinc = 1/this.slices;
    var tinc = 1/this.stacks;
    for (var a = 0; a <= this.stacks; a++) {
        for (var b = 0; b < this.slices; b++) {
            this.texCoords.push(s, t);
            s += sinc;
        }
        s = 0;
        t += tinc;
    }
    
    if(this.bottom_cap){
    	this.vertices.push(0,0,0);
    	this.normals.push(0, 0, -1);
        this.texCoords.push(0.5, 0.5);
    	var lastVertex = (this.vertices.length/3) - 1;

    	for (var slice = 0; slice < (this.slices-1); slice++) {
	        this.indices.push(lastVertex, slice + 1,slice);
	    }
	    this.indices.push(lastVertex, 0,(this.slices-1));
	}
    
    if(this.top_cap){
    	this.vertices.push(0, 0, this.height);
    	this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);
        var lastVertex = (this.vertices.length/3) - 1;

        for (var index = this.stacks * (this.slices); index+1 < (this.stacks * (this.slices+1)); index++) {
            this.indices.push(lastVertex,index,index + 1);
        }
        this.indices.push(lastVertex,this.stacks * (this.slices+1) - 1, this.stacks * (this.slices));
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

};
