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
	}else if(args.length > 5){
        this.top_cap = args[5];
        this.bottom_cap = args[6];
    }

    this.initBuffers();
};

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var angleInc = (Math.PI*2)/this.slices;
    
    var currRadius = this.bottom_radius;
    var radiusInc = (this.top_radius - this.bottom_radius)/this.stacks;

    var currHeight = 0;
    var heightInc = this.height/this.stacks;

    for(var currStack = 0; currStack < this.stacks; currStack++){
        var currAngle = 0;
        
        for(var currSlice = 0; currSlice <= this.slices; currSlice++){
            
            var x = Math.cos(currAngle) * currRadius;
            var y = Math.sin(currAngle) * currRadius;
            var z = currHeight;
            
            this.vertices.push(x,y,z);
            this.normals.push(x,y,z);
            this.texCoords.push(currSlice/this.slices, currStack/this.stacks);
            
            currAngle += angleInc;

            if(currStack > 0 && currSlice > 0){
                this.indices.push(currSlice + ((currStack-1) * (this.slices+1)), currSlice + (currStack * (this.slices+1)), currSlice-1 + ((currStack) * (this.slices+1)));
                this.indices.push(currSlice-1 + ((currStack-1) * (this.slices+1)), currSlice + ((currStack-1) * (this.slices+1)), currSlice-1 + ((currStack) * (this.slices+1)));
            }
        }
        
        currRadius += radiusInc;
        currHeight += heightInc;
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
