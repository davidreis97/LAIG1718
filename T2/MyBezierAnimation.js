/**
* MyBezierAnimation
* @constructor
*/
function MyBezierAnimation(ctrl_points, speed) {	
	this.ctrl_points = ctrl_points;

	this.previousPoint;

	this.speed = speed;
	
	this.previousTime;
	this.totalTime;
	this.maximumTime;

	this.finished;

	this.transformMatrix;

	this.init();
};

MyBezierAnimation.prototype = Object.create(MyAnimation.prototype);
MyBezierAnimation.prototype.constructor = MyAnimation;

MyBezierAnimation.prototype.bezier = function(t) {
	var c1 = (1-t) * (1-t) * (1-t);
	var c2 = 3 * t * (1-t) * (1-t);
	var c3 = 3 * t * t * (1-t);
	var c4 = t * t * t;

	var Pc1 = vec3.create();
	var Pc2 = vec3.create();
	var Pc3 = vec3.create();
	var Pc4 = vec3.create();

	Pc1 = vec3.scale(Pc1,this.ctrl_points[0],c1);
	Pc2 = vec3.scale(Pc2,this.ctrl_points[1],c2);
	Pc3 = vec3.scale(Pc3,this.ctrl_points[2],c3);
	Pc4 = vec3.scale(Pc4,this.ctrl_points[3],c4);

	var final = vec3.clone(Pc1);
	final = vec3.add(final,final,Pc2);
	final = vec3.add(final,final,Pc3);
	final = vec3.add(final,final,Pc4);
	
	return final;
}

MyBezierAnimation.prototype.init = function() { //Initial Calculations
	this.previousTime = 0;
	this.totalTime = 0;

	this.finished = false;

	this.transformMatrix = mat4.create();

	this.lastPoint = this.ctrl_points[3];

	this.maximumTime = this.basicCasteljau() * 1000 / this.speed;

	this.previousPoint = [0,0];
}

MyBezierAnimation.prototype.interpolate = function(start,finish,t) {
	var x = 0;
	var y = 1;
	var z = 2;

	var point = [];

	point[x] = start[x] + ((finish[x] - start[x]) * t);
	point[y] = start[y] + ((finish[y] - start[y]) * t);
	point[z] = start[z] + ((finish[z] - start[z]) * t);

	return point;
}


MyBezierAnimation.prototype.distanceBetween = function(start,finish) {
	var x = 0;
	var y = 1;
	var z = 2;

	return Math.sqrt(Math.pow(finish[x]-start[x],2) + Math.pow(finish[y]-start[y],2) + Math.pow(finish[z]-start[z],2));
}

MyBezierAnimation.prototype.basicCasteljau = function(){
	var p1 = this.interpolate(this.ctrl_points[0],this.ctrl_points[1],0.5);
	var p2 = this.interpolate(this.ctrl_points[1],this.ctrl_points[2],0.5);
	var p3 = this.interpolate(this.ctrl_points[2],this.ctrl_points[3],0.5);

	var p12 = this.interpolate(p1,p2,0.5);
	var p23 = this.interpolate(p2,p3,0.5);

	var p1223 = this.interpolate(p12,p23,0.5);

	var d1 = this.distanceBetween(this.ctrl_points[0],p1);
	var d2 = this.distanceBetween(p1,p12);
	var d3 = this.distanceBetween(p12,p23);
	var d4 = this.distanceBetween(p23,p3);
	var d5 = this.distanceBetween(p3,this.ctrl_points[3]);

	var totalDistance = d1 + d2 + d3 + d4 + d5;
	return totalDistance;
}

MyBezierAnimation.prototype.update = function(currentTime) {
	if(this.previousTime == 0){
		this.previousTime = currentTime;
	}else if(!this.finished){
		this.transformMatrix = mat4.create();

		var delta = currentTime - this.previousTime;
		this.previousTime = currentTime;
		this.totalTime += delta;

		if(this.totalTime > this.maximumTime){
			this.finished = true;
			var angle = Math.atan2(this.ctrl_points[3][0] - this.previousPoint[0],this.ctrl_points[3][2] - this.previousPoint[2]);
			mat4.translate(this.transformMatrix,this.transformMatrix, this.ctrl_points[3]);
			mat4.rotateY(this.transformMatrix,this.transformMatrix, angle);
			return;
		}	

		var t = this.totalTime/this.maximumTime;

		var point = this.bezier(t);

		var angle = Math.atan2(point[0] - this.previousPoint[0],point[2] - this.previousPoint[2]);

		mat4.translate(this.transformMatrix,this.transformMatrix, point);
		mat4.rotateY(this.transformMatrix,this.transformMatrix, angle);

		this.previousPoint = point;
	}
}
