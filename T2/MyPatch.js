/**
 * MyPatch
 * @constructor
 */
function MyPatch(scene, args) {
    CGFobject.call(this, scene);

   	this.controlPoints = args[2];
    this.degreeU = this.controlPoints.length - 1;
    this.degreeV = this.controlPoints[0].length - 1;
    this.divisionsU = args[0];
    this.divisionsV = args[1];

    this.surface;

    this.initBuffers();
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.getKnotsVector = function(degree) {
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}

MyPatch.prototype.initBuffers = function () {
	var knots1 = this.getKnotsVector(this.degreeU);
	var knots2 = this.getKnotsVector(this.degreeV); 
		
	var nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, knots1, knots2, this.controlPoints);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
    };
    
    this.surface = new CGFnurbsObject(this.scene, getSurfacePoint, this.divisionsU, this.divisionsV);
}

MyPatch.prototype.display = function (){
    this.surface.display();
}
